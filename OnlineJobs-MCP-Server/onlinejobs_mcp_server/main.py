"""MCP server for OnlineJobs.ph using Apify Job Radar actor."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastmcp import FastMCP

from onlinejobs_mcp_server.applications import (
    APPLICATION_STATUSES,
    create_application_package,
    list_applications,
    update_application,
    upload_application_cv,
)
from onlinejobs_mcp_server.cv_upload import CvUploadError, is_upload_configured
from onlinejobs_mcp_server.search import search_onlinejobs_markdown

mcp = FastMCP("OnlineJobs.ph (Apify)")


def _format_application_result(result: dict[str, Any]) -> str:
    lines = [
        "Application package created.\n",
        f"- **Folder:** `{result['folder']}`",
        f"- **ID:** `{result.get('id', '')}`",
        f"- **CV:** `{result['cv']}` (tagline: {result['tagline']})",
        f"- **Submission:** `{result['submission']}`",
        f"- **Job info:** `{result['job_info']}`",
    ]
    if result.get("cv_share_url"):
        lines.append(
            f"- **CV share link ({result.get('cv_upload_provider', 'cloud')}):** {result['cv_share_url']}"
        )
    if result.get("upload_error"):
        lines.append(f"- **CV upload:** skipped — {result['upload_error']}")
    elif is_upload_configured() and not result.get("cv_share_url"):
        lines.append(
            "- **CV upload:** not run (set `upload_cv_to_cloud=true` or call `upload_job_cv`)"
        )
    lines.append(
        "\nOpen `submission.txt` for the OnlineJobs.ph subject and message. "
        "Paste the share link or attach the local CV when applying."
    )
    return "\n".join(lines)


@mcp.tool()
def search_onlinejobs(
    keywords: list[str],
    maximum_items: int = 50,
    date_filter: str = "LAST_3_DAYS",
    company_name: str = "",
    remote_work: bool = False,
    max_listing_pages: int = 5,
) -> str:
    """
    Search OnlineJobs.ph for remote job listings via Apify.

    Args:
        keywords: Role/skill search terms (e.g. ["react", "laravel", "full stack developer"]).
        maximum_items: Cap on job records returned (default 50).
        date_filter: Recency window — LAST_24_HOURS or LAST_3_DAYS (Apify actor limit).
        company_name: Optional employer name substring filter (case-insensitive).
        remote_work: If true, keep only listings mentioning remote/WFH/hybrid.
        max_listing_pages: Listing pages per keyword (~30 jobs per page).
    """
    return search_onlinejobs_markdown(
        keywords=keywords,
        maximum_items=maximum_items,
        date_filter=date_filter,
        company_name=company_name,
        remote_work=remote_work,
        max_listing_pages=max_listing_pages,
    )


@mcp.tool()
def search_onlinejobs_fullstack_ai(
    maximum_items: int = 80,
    date_filter: str = "LAST_3_DAYS",
) -> str:
    """
    Preset search aligned with a senior full-stack + AI profile on OnlineJobs.ph.

    Uses keywords: full stack developer, react developer, laravel developer,
    openai, AI integration, flutter developer, firebase developer.
    """
    keywords = [
        "full stack developer",
        "react developer",
        "laravel developer",
        "openai",
        "AI integration",
        "flutter developer",
        "firebase developer",
        "senior developer",
    ]
    return search_onlinejobs_markdown(
        keywords=keywords,
        maximum_items=maximum_items,
        date_filter=date_filter,
        remote_work=False,
        max_listing_pages=8,
    )


@mcp.tool()
def create_job_application(
    job_title: str,
    job_url: str,
    company: str = "",
    job_id: str = "",
    salary: str = "",
    tailored_tagline: str = "",
    extra_notes: str = "",
    upload_cv_to_cloud: bool = True,
) -> str:
    """
    Create a per-job application folder with tailored CV, submission.txt, and job-info.json.

    When CV_UPLOAD_PROVIDER is configured (Dropbox or Google Drive), uploads the CV and
    writes a shareable link into submission.txt and job-info.json.

    Args:
        job_title: Role title from search results.
        job_url: Direct OnlineJobs.ph listing URL.
        company: Employer name (optional).
        job_id: Listing job_id from search (optional).
        salary: Salary text from listing (optional).
        tailored_tagline: Override CV header tagline (optional; auto-inferred from title if empty).
        extra_notes: Extra paragraph appended to cover message (optional).
        upload_cv_to_cloud: Upload CV to Dropbox/Google Drive when configured (default true).
    """
    result = create_application_package(
        job_title=job_title,
        company=company or None,
        job_url=job_url,
        job_id=job_id or None,
        salary=salary or None,
        tailored_tagline=tailored_tagline,
        extra_notes=extra_notes,
        upload_cv_to_cloud=upload_cv_to_cloud,
    )
    return _format_application_result(result)


@mcp.tool()
def list_job_applications(
    status: str = "",
    q: str = "",
) -> str:
    """
    List local job application folders with tracking metadata.

    Args:
        status: Filter by status (draft, submitted, interviewing, rejected, offer, withdrawn).
        q: Search title, company, or notes (case-insensitive substring).
    """
    if status and status not in APPLICATION_STATUSES:
        return f"Invalid status. Use one of: {', '.join(APPLICATION_STATUSES)}"
    apps = list_applications(status=status or None, q=q or None)
    if not apps:
        return "No job applications found."
    lines = [
        f"**{len(apps)} application(s)**\n",
        "| Status | Title | Company | Created | ID |",
        "|--------|-------|---------|---------|-----|",
    ]
    for app in apps:
        title = str(app.get("job_title", "")).replace("|", "/")
        company = str(app.get("company") or "—").replace("|", "/")
        created = str(app.get("created_at", ""))[:10]
        lines.append(
            f"| {app.get('status', 'draft')} | {title} | {company} | {created} | `{app['id']}` |"
        )
    lines.append("\nOpen the local dashboard: `uv run job-dashboard` → http://localhost:8787")
    return "\n".join(lines)


@mcp.tool()
def update_job_application(
    folder_id: str,
    status: str = "",
    notes: str = "",
) -> str:
    """
    Update tracking fields on an existing job application.

    Args:
        folder_id: Folder slug under job-applications/ (e.g. 2026-06-05_Senior-React-Developer_Acme).
        status: New status (draft, submitted, interviewing, rejected, offer, withdrawn).
        notes: Personal tracking notes (replaces existing notes when provided).
    """
    patch: dict[str, Any] = {}
    if status.strip():
        patch["status"] = status.strip()
    if notes:
        patch["notes"] = notes
    if not patch:
        return "Nothing to update. Provide status and/or notes."
    try:
        record = update_application(folder_id, patch)
    except FileNotFoundError:
        return f"Application folder not found: {folder_id}"
    except ValueError as exc:
        return str(exc)
    return (
        f"Updated `{folder_id}`.\n\n"
        f"- **Status:** {record.get('status')}\n"
        f"- **Notes:** {record.get('notes') or '(empty)'}\n"
        f"- **Updated at:** {record.get('updated_at')}"
    )


@mcp.tool()
def upload_job_cv(
    application_folder: str,
    extra_notes: str = "",
) -> str:
    """
    Upload (or re-upload) the CV from an existing job application folder to Dropbox or Google Drive.

    Updates job-info.json and submission.txt with the shareable link.

    Args:
        application_folder: Path to job-applications/YYYY-MM-DD_Title_Company folder.
        extra_notes: Optional cover-message notes when rewriting submission.txt.
    """
    folder = Path(application_folder).resolve()
    cv_path = folder / "CARLLOUISMANUEL-CV.docx"
    job_info_path = folder / "job-info.json"
    submission_path = folder / "submission.txt"

    if not cv_path.is_file():
        raise FileNotFoundError(f"CV not found: {cv_path}")
    if not job_info_path.is_file():
        raise FileNotFoundError(f"job-info.json not found: {job_info_path}")

    job_info = json.loads(job_info_path.read_text(encoding="utf-8"))
    try:
        result = upload_application_cv(
            cv_path,
            job_info_path,
            submission_path,
            job_info.get("job_title", ""),
            job_info.get("company"),
            job_info.get("job_url", ""),
            extra_notes,
        )
    except CvUploadError as exc:
        return f"CV upload failed: {exc}"

    return (
        f"CV uploaded to {result['provider']}.\n\n"
        f"- **Share link:** {result['share_url']}\n"
        f"- **Updated:** `{submission_path}`\n"
        f"- **Updated:** `{job_info_path}`"
    )


def run_server():
    mcp.run(transport="stdio")


if __name__ == "__main__":
    run_server()
