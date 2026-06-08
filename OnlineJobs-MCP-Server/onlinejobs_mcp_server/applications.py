"""Job application folder helpers for OnlineJobs.ph workflow."""

from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from onlinejobs_mcp_server.cv_upload import CvUploadError, is_upload_configured, upload_cv

REPO_ROOT = Path(__file__).resolve().parents[2]
JOB_APPLICATIONS_ROOT = REPO_ROOT / "job-applications"
WORD_MCP_DIR = REPO_ROOT / "Office-Word-MCP-Server"
CV_SCRIPT = WORD_MCP_DIR / "apply_canva_cv_design.py"
DEFAULT_TAGLINE = "Senior Full-Stack Engineer · AI Integration Specialist"
APPLICATION_STATUSES = (
    "draft",
    "submitted",
    "interviewing",
    "rejected",
    "offer",
    "withdrawn",
)
CV_FILENAME = "CARLLOUISMANUEL-CV.docx"
JOB_INFO_FILENAME = "job-info.json"
SUBMISSION_FILENAME = "submission.txt"


def slug_part(text: str | None, max_len: int = 45) -> str:
    if not text or not str(text).strip():
        return "Unknown"
    s = re.sub(r"[^\w\s-]", "", str(text), flags=re.ASCII)
    s = re.sub(r"[-\s]+", "-", s.strip())
    return (s[:max_len].rstrip("-") or "Unknown")


def infer_tagline(job_title: str, override: str = "") -> str:
    if override.strip():
        return override.strip()
    t = job_title.lower()
    if any(k in t for k in ("ai", "openai", "llm", "machine learning", "claude", "gpt")):
        return "Full-Stack Engineer · AI Integration Specialist"
    if "react" in t and ("node" in t or "full" in t or "stack" in t):
        return "Senior React Developer · Full-Stack Engineer"
    if "react" in t:
        return "React Developer · Frontend Specialist"
    if "laravel" in t or ("php" in t and "developer" in t):
        return "Senior PHP/Laravel Engineer · Full-Stack Developer"
    if "flutter" in t or "mobile" in t:
        return "Full-Stack Engineer · Flutter & Mobile Developer"
    if "firebase" in t:
        return "Full-Stack Engineer · Firebase & Cloud Apps"
    return DEFAULT_TAGLINE


def infer_skills(job_title: str) -> str:
    t = job_title.lower()
    skills: list[str] = []
    if "react" in t:
        skills.append("React")
    if "laravel" in t or "php" in t:
        skills.append("Laravel/PHP")
    if "node" in t or "typescript" in t:
        skills.append("Node.js/TypeScript")
    if any(k in t for k in ("ai", "openai", "llm", "claude")):
        skills.append("OpenAI API & AI integration")
    if "flutter" in t:
        skills.append("Flutter")
    if "firebase" in t:
        skills.append("Firebase")
    if "full stack" in t or "fullstack" in t or "full-stack" in t:
        skills.append("full-stack delivery")
    if not skills:
        return (
            "full-stack web development, React, Laravel, Firebase, and AI-powered features"
        )
    return ", ".join(skills)


def infer_hook(job_title: str) -> str:
    t = job_title.lower()
    if "react" in t:
        return (
            "At Metrobank I delivered secure React/Redux banking UIs with strong test coverage; "
            "I also led a full legacy-to-React migration at GoAutoDial that improved reliability "
            "for call-center agents."
        )
    if "laravel" in t or "php" in t:
        return (
            "I have deep Laravel and PHP experience across banking, SaaS, and enterprise clients, "
            "including API integrations, payment gateways, and production deployments on modern stacks."
        )
    if any(k in t for k in ("ai", "openai", "llm")):
        return (
            "I integrate OpenAI and LLM capabilities into real products—not demos—including "
            "client-facing features and disciplined full-stack delivery for regulated industries."
        )
    if "flutter" in t or "mobile" in t:
        return (
            "I build cross-platform apps with Flutter and Firebase, including real-time backends "
            "and API integration work for banking and startup clients."
        )
    return (
        "My background spans Metrobank (banking), ABS-CBN (media at scale), and GoAutoDial "
        "(legacy modernization)—I ship secure, maintainable systems end to end."
    )


def build_submission_text(
    job_title: str,
    company: str | None,
    job_url: str,
    extra_notes: str = "",
    cv_share_url: str = "",
) -> str:
    employer = (company or "").strip() or "Hiring Manager"
    greeting = f"Hi {employer}," if company and company.strip() else "Hi Hiring Manager,"
    skills = infer_skills(job_title)
    hook = infer_hook(job_title)
    extra_block = f"\n\n{extra_notes.strip()}" if extra_notes.strip() else ""
    if cv_share_url.strip():
        cv_line = f"CV (shareable link): {cv_share_url.strip()}"
    else:
        cv_line = "CV attached."

    body = f"""SUBJECT: Application for {job_title} — Carl Louis Manuel

--- ONLINEJOBS.PH MESSAGE ---

{greeting}

I'm Carl Louis Manuel, a Senior Full-Stack Engineer with 12+ years of experience building production-grade web applications and AI-powered products for banks, media companies, and enterprises across the Philippines.

I came across your listing for {job_title} on OnlineJobs.ph and I believe my background in {skills} aligns well with what you're looking for.

{hook}{extra_block}

My portfolio and full work history: https://carlmanuel.com
{cv_line}

Best regards,
Carl Louis Manuel
carllouismanuel09@gmail.com
carlmanuel.com | github.com/carlxaeron
---
URL: {job_url}
"""
    return body


def application_folder_name(job_title: str, company: str | None) -> str:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"{today}_{slug_part(job_title)}_{slug_part(company)}"


def application_folder_path(folder_id: str) -> Path:
    folder = (JOB_APPLICATIONS_ROOT / folder_id).resolve()
    if not folder.is_dir() or folder.parent != JOB_APPLICATIONS_ROOT.resolve():
        raise FileNotFoundError(f"Application folder not found: {folder_id}")
    return folder


def normalize_job_info(data: dict[str, Any], folder_id: str) -> dict[str, Any]:
    created_at = data.get("created_at") or datetime.now(timezone.utc).isoformat()
    status = data.get("status") or "draft"
    if status not in APPLICATION_STATUSES:
        status = "draft"
    out = {
        **data,
        "id": folder_id,
        "status": status,
        "notes": data.get("notes") or "",
        "submitted_at": data.get("submitted_at"),
        "updated_at": data.get("updated_at") or created_at,
        "location": data.get("location"),
        "posted_at": data.get("posted_at"),
    }
    return out


def list_applications(
    status: str | None = None,
    q: str | None = None,
) -> list[dict[str, Any]]:
    if not JOB_APPLICATIONS_ROOT.is_dir():
        return []

    query = (q or "").strip().lower()
    apps: list[dict[str, Any]] = []
    for folder in JOB_APPLICATIONS_ROOT.iterdir():
        if not folder.is_dir():
            continue
        job_info_path = folder / JOB_INFO_FILENAME
        if not job_info_path.is_file():
            continue
        data = json.loads(job_info_path.read_text(encoding="utf-8"))
        record = normalize_job_info(data, folder.name)
        if status and record["status"] != status:
            continue
        if query:
            haystack = " ".join(
                str(record.get(k, "") or "")
                for k in ("job_title", "company", "notes", "tailored_tagline")
            ).lower()
            if query not in haystack:
                continue
        apps.append(record)

    apps.sort(key=lambda item: item.get("created_at") or "", reverse=True)
    return apps


def get_application(folder_id: str) -> dict[str, Any]:
    folder = application_folder_path(folder_id)
    job_info_path = folder / JOB_INFO_FILENAME
    data = json.loads(job_info_path.read_text(encoding="utf-8"))
    record = normalize_job_info(data, folder_id)
    submission_path = folder / SUBMISSION_FILENAME
    if submission_path.is_file():
        record["submission_preview"] = submission_path.read_text(encoding="utf-8")
    cv_path = folder / CV_FILENAME
    record["has_cv"] = cv_path.is_file()
    return record


def read_submission(folder_id: str) -> str:
    folder = application_folder_path(folder_id)
    submission_path = folder / SUBMISSION_FILENAME
    if not submission_path.is_file():
        raise FileNotFoundError(f"submission.txt not found for {folder_id}")
    return submission_path.read_text(encoding="utf-8")


def cv_file_path(folder_id: str) -> Path:
    folder = application_folder_path(folder_id)
    cv_path = folder / CV_FILENAME
    if not cv_path.is_file():
        raise FileNotFoundError(f"CV not found for {folder_id}")
    return cv_path


def update_application(folder_id: str, patch: dict[str, Any]) -> dict[str, Any]:
    folder = application_folder_path(folder_id)
    job_info_path = folder / JOB_INFO_FILENAME
    data = json.loads(job_info_path.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).isoformat()

    if "status" in patch and patch["status"] is not None:
        status = str(patch["status"]).strip()
        if status not in APPLICATION_STATUSES:
            raise ValueError(f"status must be one of: {', '.join(APPLICATION_STATUSES)}")
        data["status"] = status
        if status == "submitted" and not data.get("submitted_at"):
            data["submitted_at"] = now

    if "notes" in patch:
        data["notes"] = str(patch.get("notes") or "")

    if "submitted_at" in patch:
        data["submitted_at"] = patch["submitted_at"]

    data["updated_at"] = now
    job_info_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return normalize_job_info(data, folder_id)


def generate_cv(output_path: Path, tagline: str) -> None:
    if not CV_SCRIPT.is_file():
        raise FileNotFoundError(f"CV script not found: {CV_SCRIPT}")
    cmd = [
        "uv",
        "run",
        "python",
        "apply_canva_cv_design.py",
        "--output",
        str(output_path.resolve()),
        "--tagline",
        tagline,
        "--no-backup",
    ]
    subprocess.run(cmd, check=True, cwd=str(WORD_MCP_DIR), timeout=180)


def upload_application_cv(
    cv_path: Path,
    job_info_path: Path,
    submission_path: Path,
    job_title: str,
    company: str | None,
    job_url: str,
    extra_notes: str = "",
) -> dict[str, Any]:
    """Upload CV to cloud and refresh job-info.json + submission.txt with share link."""
    result = upload_cv(cv_path)
    job_info = json.loads(job_info_path.read_text(encoding="utf-8"))
    job_info["cv_share_url"] = result["share_url"]
    job_info["cv_upload_provider"] = result["provider"]
    job_info_path.write_text(json.dumps(job_info, indent=2), encoding="utf-8")

    submission_path.write_text(
        build_submission_text(
            job_title,
            company,
            job_url,
            extra_notes,
            cv_share_url=result["share_url"],
        ),
        encoding="utf-8",
    )
    return result


def create_application_package(
    job_title: str,
    company: str | None,
    job_url: str,
    job_id: str | None = None,
    salary: str | None = None,
    tailored_tagline: str = "",
    extra_notes: str = "",
    upload_cv_to_cloud: bool = True,
    location: str | None = None,
    posted_at: str | None = None,
) -> dict[str, Any]:
    folder_name = application_folder_name(job_title, company)
    folder = JOB_APPLICATIONS_ROOT / folder_name
    folder.mkdir(parents=True, exist_ok=True)

    tagline = infer_tagline(job_title, tailored_tagline)
    cv_path = folder / CV_FILENAME
    submission_path = folder / SUBMISSION_FILENAME
    job_info_path = folder / JOB_INFO_FILENAME
    now = datetime.now(timezone.utc).isoformat()

    job_info = {
        "created_at": now,
        "updated_at": now,
        "status": "draft",
        "notes": "",
        "submitted_at": None,
        "job_id": job_id,
        "job_title": job_title,
        "company": company,
        "salary": salary,
        "job_url": job_url,
        "location": location,
        "posted_at": posted_at,
        "tailored_tagline": tagline,
        "folder": str(folder),
    }
    job_info_path.write_text(json.dumps(job_info, indent=2), encoding="utf-8")

    submission_path.write_text(
        build_submission_text(job_title, company, job_url, extra_notes),
        encoding="utf-8",
    )

    generate_cv(cv_path, tagline)

    upload_result: dict[str, Any] | None = None
    upload_error: str | None = None
    if upload_cv_to_cloud and is_upload_configured():
        try:
            upload_result = upload_application_cv(
                cv_path,
                job_info_path,
                submission_path,
                job_title,
                company,
                job_url,
                extra_notes,
            )
        except CvUploadError as exc:
            upload_error = str(exc)

    out: dict[str, Any] = {
        "id": folder_name,
        "folder": str(folder),
        "cv": str(cv_path),
        "submission": str(submission_path),
        "job_info": str(job_info_path),
        "tagline": tagline,
    }
    if upload_result:
        out["cv_share_url"] = upload_result["share_url"]
        out["cv_upload_provider"] = upload_result["provider"]
    if upload_error:
        out["upload_error"] = upload_error
    return out
