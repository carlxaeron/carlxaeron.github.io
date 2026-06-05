#!/usr/bin/env python3
"""One-time OAuth flow to obtain GOOGLE_DRIVE_REFRESH_TOKEN for CV uploads."""

from __future__ import annotations

import json
import sys
from pathlib import Path

SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def main() -> None:
    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("Run: uv add google-auth-oauthlib", file=sys.stderr)
        sys.exit(1)

    creds_path = Path(__file__).resolve().parents[1] / "google_drive_credentials.json"
    if not creds_path.is_file():
        print(
            "Missing google_drive_credentials.json\n"
            "1. Google Cloud Console → APIs → enable Google Drive API\n"
            "2. Credentials → OAuth client ID → Desktop app\n"
            "3. Download JSON and save as:\n"
            f"   {creds_path}",
            file=sys.stderr,
        )
        sys.exit(1)

    flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), SCOPES)
    creds = flow.run_local_server(port=0)

    data = json.loads(creds_path.read_text(encoding="utf-8"))
    installed = data.get("installed") or data.get("web") or {}

    print("\nAdd these to OnlineJobs-MCP-Server/.env:\n")
    print(f"CV_UPLOAD_PROVIDER=google_drive")
    print(f"GOOGLE_DRIVE_CLIENT_ID={installed.get('client_id', '')}")
    print(f"GOOGLE_DRIVE_CLIENT_SECRET={installed.get('client_secret', '')}")
    print(f"GOOGLE_DRIVE_REFRESH_TOKEN={creds.refresh_token}")
    print("\nOptional: GOOGLE_DRIVE_FOLDER_ID=<folder id in your Drive>")
    print("\nRestart Cursor after updating MCP env.")


if __name__ == "__main__":
    main()
