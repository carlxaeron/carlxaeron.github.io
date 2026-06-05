"""Job application folder helpers for OnlineJobs.ph workflow."""

from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
JOB_APPLICATIONS_ROOT = REPO_ROOT / "job-applications"
WORD_MCP_DIR = REPO_ROOT / "Office-Word-MCP-Server"
CV_SCRIPT = WORD_MCP_DIR / "apply_canva_cv_design.py"
DEFAULT_TAGLINE = "Senior Full-Stack Engineer · AI Integration Specialist"


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
) -> str:
    employer = (company or "").strip() or "Hiring Manager"
    greeting = f"Hi {employer}," if company and company.strip() else "Hi Hiring Manager,"
    skills = infer_skills(job_title)
    hook = infer_hook(job_title)
    extra_block = f"\n\n{extra_notes.strip()}" if extra_notes.strip() else ""

    body = f"""SUBJECT: Application for {job_title} — Carl Louis Manuel

--- ONLINEJOBS.PH MESSAGE ---

{greeting}

I'm Carl Louis Manuel, a Senior Full-Stack Engineer with 12+ years of experience building production-grade web applications and AI-powered products for banks, media companies, and enterprises across the Philippines.

I came across your listing for {job_title} on OnlineJobs.ph and I believe my background in {skills} aligns well with what you're looking for.

{hook}{extra_block}

My portfolio and full work history: https://carlmanuel.com
CV attached.

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


def create_application_package(
    job_title: str,
    company: str | None,
    job_url: str,
    job_id: str | None = None,
    salary: str | None = None,
    tailored_tagline: str = "",
    extra_notes: str = "",
) -> dict[str, Any]:
    folder_name = application_folder_name(job_title, company)
    folder = JOB_APPLICATIONS_ROOT / folder_name
    folder.mkdir(parents=True, exist_ok=True)

    tagline = infer_tagline(job_title, tailored_tagline)
    cv_path = folder / "CARLLOUISMANUEL-CV.docx"
    submission_path = folder / "submission.txt"
    job_info_path = folder / "job-info.json"

    job_info = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "job_id": job_id,
        "job_title": job_title,
        "company": company,
        "salary": salary,
        "job_url": job_url,
        "tailored_tagline": tagline,
        "folder": str(folder),
    }
    job_info_path.write_text(json.dumps(job_info, indent=2), encoding="utf-8")

    submission_path.write_text(
        build_submission_text(job_title, company, job_url, extra_notes),
        encoding="utf-8",
    )

    generate_cv(cv_path, tagline)

    return {
        "folder": str(folder),
        "cv": str(cv_path),
        "submission": str(submission_path),
        "job_info": str(job_info_path),
        "tagline": tagline,
    }
