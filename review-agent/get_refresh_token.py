"""One-time helper: sign in with the Google account that manages your Business
Profile and print the refresh token the agent needs.

    GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... python get_refresh_token.py

It opens a sign-in link; after you approve, Google redirects to
http://localhost:8765 and this script captures the code.
"""

import http.server
import os
import sys
import urllib.parse
import webbrowser

import requests

SCOPE = "https://www.googleapis.com/auth/business.manage"
PORT = 8765
REDIRECT = f"http://localhost:{PORT}"

client_id = os.environ.get("GOOGLE_CLIENT_ID") or input("Google client ID: ").strip()
client_secret = os.environ.get("GOOGLE_CLIENT_SECRET") or input("Google client secret: ").strip()

auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(
    {
        "client_id": client_id,
        "redirect_uri": REDIRECT,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",
    }
)

code_holder: dict = {}


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        code_holder["code"] = qs.get("code", [""])[0]
        code_holder["error"] = qs.get("error", [""])[0]
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Done - you can close this tab and go back to the terminal.")

    def log_message(self, *args):
        pass


print("Open this link and sign in with the Google account that manages your Business Profile:\n")
print(auth_url + "\n")
webbrowser.open(auth_url)
http.server.HTTPServer(("localhost", PORT), Handler).handle_request()

if not code_holder.get("code"):
    sys.exit(f"Sign-in failed: {code_holder.get('error') or 'no code returned'}")

resp = requests.post(
    "https://oauth2.googleapis.com/token",
    data={
        "code": code_holder["code"],
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT,
        "grant_type": "authorization_code",
    },
    timeout=30,
)
resp.raise_for_status()
token = resp.json().get("refresh_token")
if not token:
    sys.exit("Google didn't return a refresh token. Remove the app's access at "
             "https://myaccount.google.com/permissions and run this again.")
print("\nYour GOOGLE_REFRESH_TOKEN (store it as a GitHub secret, keep it private):\n")
print(token)
