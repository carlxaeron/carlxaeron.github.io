"""Upload CV to Dropbox or Google Drive and return a shareable link."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any


class CvUploadError(Exception):
    pass


def _provider() -> str:
    return os.environ.get("CV_UPLOAD_PROVIDER", "").strip().lower()


def upload_cv(file_path: Path, remote_name: str | None = None) -> dict[str, Any]:
    """
    Upload a CV file to the configured cloud provider.

    Set CV_UPLOAD_PROVIDER to `dropbox` or `google_drive` in .env / MCP env.
    """
    provider = _provider()
    if not provider:
        raise CvUploadError(
            "CV_UPLOAD_PROVIDER is not set. Use 'dropbox' or 'google_drive'. "
            "See OnlineJobs-MCP-Server/README.md for setup."
        )

    path = Path(file_path).resolve()
    if not path.is_file():
        raise CvUploadError(f"CV file not found: {path}")

    name = remote_name or path.name

    if provider == "dropbox":
        url = _upload_dropbox(path, name)
    elif provider in ("google_drive", "gdrive", "google"):
        url = _upload_google_drive(path, name)
    else:
        raise CvUploadError(f"Unknown CV_UPLOAD_PROVIDER: {provider}")

    return {"provider": provider, "share_url": url, "file_name": name}


def _upload_dropbox(file_path: Path, remote_name: str) -> str:
    token = os.environ.get("DROPBOX_ACCESS_TOKEN", "").strip()
    if not token:
        raise CvUploadError("DROPBOX_ACCESS_TOKEN is not set.")

    try:
        import dropbox
        from dropbox.files import WriteMode
        from dropbox.sharing import SharedLinkSettings, RequestedVisibility
    except ImportError as exc:
        raise CvUploadError("Install dropbox: uv add dropbox") from exc

    folder = os.environ.get("DROPBOX_CV_FOLDER", "/job-applications").strip() or "/job-applications"
    if not folder.startswith("/"):
        folder = f"/{folder}"
    remote_path = f"{folder.rstrip('/')}/{remote_name}"

    dbx = dropbox.Dropbox(token)
    with file_path.open("rb") as handle:
        dbx.files_upload(handle.read(), remote_path, mode=WriteMode.overwrite)

    try:
        link = dbx.sharing_create_shared_link_with_settings(
            remote_path,
            settings=SharedLinkSettings(requested_visibility=RequestedVisibility.public),
        )
        url = link.url
    except dropbox.exceptions.ApiError as exc:
        if "shared_link_already_exists" in str(exc):
            links = dbx.sharing_list_shared_links(path=remote_path).links
            url = links[0].url if links else ""
        else:
            raise CvUploadError(f"Dropbox sharing failed: {exc}") from exc

    if not url:
        raise CvUploadError("Dropbox upload succeeded but no share link was returned.")

    return url.replace("?dl=0", "?dl=1")


def _upload_google_drive(file_path: Path, remote_name: str) -> str:
    client_id = os.environ.get("GOOGLE_DRIVE_CLIENT_ID", "").strip()
    client_secret = os.environ.get("GOOGLE_DRIVE_CLIENT_SECRET", "").strip()
    refresh_token = os.environ.get("GOOGLE_DRIVE_REFRESH_TOKEN", "").strip()
    folder_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID", "").strip()

    if not all([client_id, client_secret, refresh_token]):
        raise CvUploadError(
            "Google Drive requires GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, "
            "and GOOGLE_DRIVE_REFRESH_TOKEN. Run scripts/google_drive_auth.py once."
        )

    try:
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
    except ImportError as exc:
        raise CvUploadError(
            "Install Google API deps: uv add google-api-python-client google-auth"
        ) from exc

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/drive.file"],
    )
    creds.refresh(Request())

    service = build("drive", "v3", credentials=creds, cache_discovery=False)
    metadata: dict[str, Any] = {
        "name": remote_name,
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    if folder_id:
        metadata["parents"] = [folder_id]

    media = MediaFileUpload(
        str(file_path),
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        resumable=True,
    )
    created = (
        service.files()
        .create(body=metadata, media_body=media, fields="id,webViewLink,webContentLink")
        .execute()
    )
    file_id = created["id"]

    service.permissions().create(
        fileId=file_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return created.get("webViewLink") or f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"


def is_upload_configured() -> bool:
    provider = _provider()
    if provider == "dropbox":
        return bool(os.environ.get("DROPBOX_ACCESS_TOKEN", "").strip())
    if provider in ("google_drive", "gdrive", "google"):
        return all(
            os.environ.get(k, "").strip()
            for k in (
                "GOOGLE_DRIVE_CLIENT_ID",
                "GOOGLE_DRIVE_CLIENT_SECRET",
                "GOOGLE_DRIVE_REFRESH_TOKEN",
            )
        )
    return False
