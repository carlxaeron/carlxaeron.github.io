"""Shared OnlineJobs.ph search via Apify Job Radar actor."""

from __future__ import annotations

import json
import os
from typing import Any

from apify_client import ApifyClient

ACTOR_ID = "vjkhush/onlinejobsph-job-radar-actor"
# Apify actor only accepts these values (see actor input schema).
DATE_FILTER_CHOICES = ("LAST_24_HOURS", "LAST_3_DAYS")


def apify_client() -> ApifyClient:
    token = os.environ.get("APIFY_API_TOKEN", "").strip()
    if not token:
        raise ValueError(
            "APIFY_API_TOKEN is not set. Add it to .env, Cursor MCP env, or your shell. "
            "Get a token at https://console.apify.com/account/integrations"
        )
    return ApifyClient(token)


def dataset_id_from_run(run: Any) -> str | None:
    if isinstance(run, dict):
        return run.get("defaultDatasetId") or run.get("default_dataset_id")
    return getattr(run, "default_dataset_id", None) or getattr(run, "defaultDatasetId", None)


def run_actor(actor_input: dict[str, Any]) -> list[dict[str, Any]]:
    client = apify_client()
    run = client.actor(ACTOR_ID).call(run_input=actor_input)
    dataset_id = dataset_id_from_run(run)
    if not dataset_id:
        return []
    items: list[dict[str, Any]] = []
    for item in client.dataset(dataset_id).iterate_items():
        if isinstance(item, dict):
            items.append(item)
    return items


def normalize_job(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "job_id": raw.get("job_id"),
        "title": raw.get("title") or "Untitled",
        "company": raw.get("company") or "—",
        "salary": raw.get("salary") or "—",
        "location": raw.get("location") or "Philippines",
        "posted_at": raw.get("posted_at") or "—",
        "url": raw.get("url") or "",
    }


def build_apply_refs(jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "index": idx,
            "job_id": job["job_id"],
            "job_title": job["title"],
            "company": None if job["company"] == "—" else job["company"],
            "salary": None if job["salary"] == "—" else job["salary"],
            "location": None if job["location"] == "Philippines" else job["location"],
            "posted_at": None if job["posted_at"] == "—" else job["posted_at"],
            "job_url": job["url"],
        }
        for idx, job in enumerate(jobs, start=1)
    ]


def search_onlinejobs(
    keywords: list[str],
    maximum_items: int = 50,
    date_filter: str = "LAST_3_DAYS",
    company_name: str = "",
    remote_work: bool = False,
    max_listing_pages: int = 5,
) -> dict[str, Any]:
    """Run search and return structured JSON for API/dashboard use."""
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

    raw_items = run_actor(actor_input)
    jobs = [normalize_job(raw) for raw in raw_items]
    return {
        "total": len(jobs),
        "jobs": jobs,
        "apply_refs": build_apply_refs(jobs),
    }


def format_jobs_markdown(items: list[dict[str, Any]], limit: int = 30) -> str:
    if not items:
        return "No jobs found for this search.\n"

    shown = [normalize_job(raw) for raw in items[:limit]]
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
    lines.append(json.dumps(build_apply_refs(shown), indent=2))
    lines.append("```")
    return "\n".join(lines)


def search_onlinejobs_markdown(
    keywords: list[str],
    maximum_items: int = 50,
    date_filter: str = "LAST_3_DAYS",
    company_name: str = "",
    remote_work: bool = False,
    max_listing_pages: int = 5,
) -> str:
    result = search_onlinejobs(
        keywords=keywords,
        maximum_items=maximum_items,
        date_filter=date_filter,
        company_name=company_name,
        remote_work=remote_work,
        max_listing_pages=max_listing_pages,
    )
    return format_jobs_markdown(result["jobs"])
