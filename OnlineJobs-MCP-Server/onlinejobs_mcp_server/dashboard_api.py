"""Local FastAPI dashboard for job application tracking."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from apify_client.errors import ApifyApiError
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from onlinejobs_mcp_server.applications import (
    APPLICATION_STATUSES,
    create_application_package,
    cv_file_path,
    get_application,
    list_applications,
    read_submission,
    update_application,
    upload_application_cv,
)
from onlinejobs_mcp_server.cv_upload import CvUploadError
from onlinejobs_mcp_server.search import DATE_FILTER_CHOICES, search_onlinejobs

PACKAGE_DIR = Path(__file__).resolve().parent
SERVER_ROOT = PACKAGE_DIR.parent
DASHBOARD_DIST = SERVER_ROOT / "dashboard-ui" / "dist"
ENV_PATH = SERVER_ROOT / ".env"


def load_dotenv() -> None:
    if not ENV_PATH.is_file():
        return
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


load_dotenv()

app = FastAPI(title="Job Applications Dashboard", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8787",
        "http://127.0.0.1:8787",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApplicationCreate(BaseModel):
    job_title: str
    job_url: str
    company: str = ""
    job_id: str = ""
    salary: str = ""
    tailored_tagline: str = ""
    extra_notes: str = ""
    upload_cv_to_cloud: bool = True
    location: str = ""
    posted_at: str = ""


class ApplicationPatch(BaseModel):
    status: str | None = None
    notes: str | None = None
    submitted_at: str | None = None


class SearchRequest(BaseModel):
    keywords: list[str] = Field(default_factory=list)
    maximum_items: int = 50
    date_filter: str = "LAST_3_DAYS"
    company_name: str = ""
    remote_work: bool = False
    max_listing_pages: int = 5


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/meta")
def meta() -> dict[str, Any]:
    return {
        "statuses": list(APPLICATION_STATUSES),
        "date_filters": list(DATE_FILTER_CHOICES),
    }


@app.get("/api/applications")
def api_list_applications(
    status: str | None = Query(default=None),
    q: str | None = Query(default=None),
) -> dict[str, Any]:
    if status and status not in APPLICATION_STATUSES:
        raise HTTPException(400, f"status must be one of: {', '.join(APPLICATION_STATUSES)}")
    apps = list_applications(status=status, q=q)
    return {"applications": apps, "total": len(apps)}


@app.get("/api/applications/{folder_id}")
def api_get_application(folder_id: str) -> dict[str, Any]:
    try:
        return get_application(folder_id)
    except FileNotFoundError as exc:
        raise HTTPException(404, str(exc)) from exc


@app.patch("/api/applications/{folder_id}")
def api_patch_application(folder_id: str, body: ApplicationPatch) -> dict[str, Any]:
    try:
        return update_application(folder_id, body.model_dump(exclude_unset=True))
    except FileNotFoundError as exc:
        raise HTTPException(404, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.get("/api/applications/{folder_id}/submission")
def api_get_submission(folder_id: str) -> dict[str, str]:
    try:
        return {"text": read_submission(folder_id)}
    except FileNotFoundError as exc:
        raise HTTPException(404, str(exc)) from exc


@app.get("/api/applications/{folder_id}/cv")
def api_download_cv(folder_id: str) -> FileResponse:
    try:
        path = cv_file_path(folder_id)
    except FileNotFoundError as exc:
        raise HTTPException(404, str(exc)) from exc
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=path.name,
    )


@app.post("/api/applications/{folder_id}/upload-cv")
def api_upload_cv(folder_id: str) -> dict[str, Any]:
    try:
        record = get_application(folder_id)
        folder = Path(record["folder"])
        result = upload_application_cv(
            folder / "CARLLOUISMANUEL-CV.docx",
            folder / "job-info.json",
            folder / "submission.txt",
            record.get("job_title", ""),
            record.get("company"),
            record.get("job_url", ""),
            record.get("notes") or "",
        )
        return {"ok": True, **result}
    except FileNotFoundError as exc:
        raise HTTPException(404, str(exc)) from exc
    except CvUploadError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/api/applications")
def api_create_application(body: ApplicationCreate) -> dict[str, Any]:
    if not body.job_title.strip() or not body.job_url.strip():
        raise HTTPException(400, "job_title and job_url are required")
    try:
        result = create_application_package(
            job_title=body.job_title.strip(),
            company=body.company.strip() or None,
            job_url=body.job_url.strip(),
            job_id=body.job_id.strip() or None,
            salary=body.salary.strip() or None,
            tailored_tagline=body.tailored_tagline,
            extra_notes=body.extra_notes,
            upload_cv_to_cloud=body.upload_cv_to_cloud,
            location=body.location.strip() or None,
            posted_at=body.posted_at.strip() or None,
        )
        record = get_application(result["id"])
        return {"ok": True, "result": result, "application": record}
    except Exception as exc:
        raise HTTPException(500, str(exc)) from exc


@app.post("/api/search")
def api_search(body: SearchRequest) -> dict[str, Any]:
    if not body.keywords:
        raise HTTPException(400, "keywords must contain at least one search term")
    if body.date_filter not in DATE_FILTER_CHOICES:
        raise HTTPException(400, f"date_filter must be one of: {', '.join(DATE_FILTER_CHOICES)}")
    try:
        return search_onlinejobs(
            keywords=body.keywords,
            maximum_items=body.maximum_items,
            date_filter=body.date_filter,
            company_name=body.company_name,
            remote_work=body.remote_work,
            max_listing_pages=body.max_listing_pages,
        )
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except ApifyApiError as exc:
        raise HTTPException(502, f"Apify search failed: {exc}") from exc


if DASHBOARD_DIST.is_dir():
    app.mount("/", StaticFiles(directory=str(DASHBOARD_DIST), html=True), name="dashboard")


def run() -> None:
    import uvicorn

    port = int(os.environ.get("DASHBOARD_PORT", "8787"))
    uvicorn.run(
        "onlinejobs_mcp_server.dashboard_api:app",
        host="127.0.0.1",
        port=port,
        reload=False,
    )


if __name__ == "__main__":
    run()
