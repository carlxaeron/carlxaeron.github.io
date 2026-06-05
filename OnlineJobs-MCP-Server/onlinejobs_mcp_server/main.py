"""MCP server for OnlineJobs.ph using Apify Job Radar actor."""

from __future__ import annotations

import json
from typing import Any

from apify_client import ApifyClient
from fastmcp import FastMCP

from onlinejobs_mcp_server.applications import create_application_package

ACTOR_ID = "vjkhush/onlinejobsph-job-radar-actor"
DATE_FILTER_CHOICES = ("LAST_24_HOURS", "LAST_3_DAYS", "LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS")

mcp = FastMCP("OnlineJobs.ph (Apify)")


def _client() -> ApifyClient:
    import os

    token = os.environ.get("APIFY_API_TOKEN", "").strip()
    if not token:
        raise ValueError(
            "APIFY_API_TOKEN is not set. Add it to Cursor MCP env or export it in your shell. "
            "Get a token at https://console.apify.com/account/integrations"
        )
    return ApifyClient(token)


def _dataset_id_from_run(run: Any) -> str | None:
    if isinstance(run, dict):
        return run.get("defaultDatasetId") or run.get("default_dataset_id")
    return getattr(run, "default_dataset_id", None) or getattr(run, "defaultDatasetId", None)


def _run_actor(actor_input: dict[str, Any]) -> list[dict[str, Any]]:
    client = _client()
    run = client.actor(ACTOR_ID).call(run_input=actor_input)
    dataset_id = _dataset_id_from_run(run)
    if not dataset_id:
        return []
    items: list[dict[str, Any]] = []
    for item in client.dataset(dataset_id).iterate_items():
        if isinstance(item, dict):
            items.append(item)
    return items


def _normalize_job(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "job_id": raw.get("job_id"),
        "title": raw.get("title") or "Untitled",
        "company": raw.get("company") or "—",
        "salary": raw.get("salary") or "—",
        "location": raw.get("location") or "Philippines",
        "posted_at": raw.get("posted_at") or "—",
        "url": raw.get("url") or "",
    }


def _format_jobs(items: list[dict[str, Any]], limit: int = 30) -> str:
    if not items:
        return "No jobs found for this search.\n"

    shown = [_normalize_job(raw) for raw in items[:limit]]
    lines = [
        f"**{len(items)} job(s) found** (showing {len(shown)}). "
        "Say **apply to #N** to create a folder with CV + submission.txt.\n",
        "| # | Title | Company | Salary | Posted |",
        "|---|-------|---------|--------|--------|",
    ]
    for idx, job in enumerate(shown, start=1):
        title = str(job["title"]).replace("|", "/")
        company = str(job["company"]).replace("|", "/")
        salary = str(job["salary"]).replace("|", "/")
        posted = str(job["posted_at"]).replace("|", "/")
        lines.append(f"| {idx} | {title} | {company} | {salary} | {posted} |")

    lines.append("\n**Links**\n")
    for idx, job in enumerate(shown, start=1):
        url = job["url"]
        if url:
            lines.append(f"- #{idx}: {url}")

    lines.append("\n**Apply reference (JSON)**\n")
    lines.append("```json")
    apply_refs = [
        {
            "index": idx,
            "job_id": job["job_id"],
            "job_title": job["title"],
            "company": None if job["company"] == "—" else job["company"],
            "salary": None if job["salary"] == "—" else job["salary"],
            "job_url": job["url"],
        }
        for idx, job in enumerate(shown, start=1)
    ]
    lines.append(json.dumps(apply_refs, indent=2))
    lines.append("```")
    return "\n".join(lines)


def _search_onlinejobs_impl(
    keywords: list[str],
    maximum_items: int = 50,
    date_filter: str = "LAST_3_DAYS",
    company_name: str = "",
    remote_work: bool = False,
    max_listing_pages: int = 5,
) -> str:
    if not keywords:
        raise ValueError("keywords must contain at least one search term")

    if date_filter not in DATE_FILTER_CHOICES:
        raise ValueError(f"date_filter must be one of: {', '.join(DATE_FILTER_CHOICES)}")

    actor_input: dict[str, Any] = {
        "keywords": keywords,
        "maximumItems": max(1, min(maximum_items, 500)),
        "dateFilter": date_filter,
        "maxListingPages": max(1, min(max_listing_pages, 25)),
        "maxConcurrency": 1,
        "proxyConfiguration": {"useApifyProxy": True, "groups": ["RESIDENTIAL"]},
    }
    if company_name.strip():
        actor_input["companyName"] = company_name.strip()
    if remote_work:
        actor_input["remoteWork"] = True

    items = _run_actor(actor_input)
    return _format_jobs(items)


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
        date_filter: Recency window — LAST_24_HOURS, LAST_3_DAYS, LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS.
        company_name: Optional employer name substring filter (case-insensitive).
        remote_work: If true, keep only listings mentioning remote/WFH/hybrid.
        max_listing_pages: Listing pages per keyword (~30 jobs per page).
    """
    return _search_onlinejobs_impl(
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
    return _search_onlinejobs_impl(
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
) -> str:
    """
    Create a per-job application folder with tailored CV, submission.txt, and job-info.json.

    Args:
        job_title: Role title from search results.
        job_url: Direct OnlineJobs.ph listing URL.
        company: Employer name (optional).
        job_id: Listing job_id from search (optional).
        salary: Salary text from listing (optional).
        tailored_tagline: Override CV header tagline (optional; auto-inferred from title if empty).
        extra_notes: Extra paragraph appended to cover message (optional).
    """
    result = create_application_package(
        job_title=job_title,
        company=company or None,
        job_url=job_url,
        job_id=job_id or None,
        salary=salary or None,
        tailored_tagline=tailored_tagline,
        extra_notes=extra_notes,
    )
    return (
        f"Application package created.\n\n"
        f"- **Folder:** `{result['folder']}`\n"
        f"- **CV:** `{result['cv']}` (tagline: {result['tagline']})\n"
        f"- **Submission:** `{result['submission']}`\n"
        f"- **Job info:** `{result['job_info']}`\n\n"
        f"Open `submission.txt` for the OnlineJobs.ph subject and message. "
        f"Attach the CV from the same folder when applying."
    )


def run_server():
    mcp.run(transport="stdio")


if __name__ == "__main__":
    run_server()
