# Google review auto-responder

An AI agent that answers your Google reviews for you. Every day at 9pm it checks
your Google Business Profile, has Claude write a personal reply to each new
review, and posts it.

Replies are personalised (first name plus something specific from the review),
follow a different approach for each star rating, and are always signed off
**Coastcom Security Team**.

| Review | What happens |
| --- | --- |
| 5 stars | Warm thanks that picks up on what they praised. Posted automatically. |
| 4 stars | Thanks, and briefly acknowledges anything they'd improve. Posted automatically. |
| 3 stars | Thanks for honest feedback, owns what wasn't right, invites them to get in touch. Posted automatically. |
| 2 stars | Sincere apology, takes it offline. Posted automatically. |
| 1 star | Calm apology, offers a direct line to fix it. Posted automatically. |
| Any rating that mentions a break-in or incident, alarm/camera failure, police, insurance, footage, privacy, billing disputes, damage, injury, legal action, abuse, or looks like spam | **Not posted.** You get an email with a suggested reply to edit and post yourself. |
| Already has a reply | Skipped. |

You get an email after each run listing what was posted and anything held back.

The per-star guidance, example replies, tone and "hold for the owner" rules are
in [`business.md`](business.md). **Fill in the TODOs there** (services, area,
licence, contact details) so replies can point unhappy customers to the right
place. Claude won't claim anything that isn't in that file.

To approve low-star replies yourself before they go up, raise
`AUTO_REPLY_MIN_STARS` in `.github/workflows/review-agent.yml` (e.g. `3` holds
1 and 2 star replies for you). The sign-off is `SIGN_OFF` in the same file.

---

## Setup (about 30 minutes, plus waiting on Google)

### 1. Get Google API access (do this first, approval can take a few days)

Google keeps the reviews API locked until you request access.

1. Go to <https://console.cloud.google.com/>, create a project (e.g. "Review agent").
2. Fill in the **Business Profile API access request**:
   <https://developers.google.com/my-business/content/prereqs#request-access>.
   Use the same Google account that manages the Business Profile. Your profile
   must be verified and active for 60+ days.
3. Once approved, in the Cloud project go to **APIs & Services → Library** and enable:
   - Google My Business API
   - My Business Account Management API
   - My Business Business Information API
4. **APIs & Services → OAuth consent screen**: set it up as *External*, add your
   own email as a test user, then **Publish app**. (If it stays in "Testing",
   the sign-in expires after 7 days and the agent stops working.)
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type **Desktop app**. Copy the **Client ID** and **Client secret**.

### 2. Get your refresh token and location ID (on your own computer)

```bash
cd review-agent
pip install -r requirements.txt
```

```bash
GOOGLE_CLIENT_ID=your-id GOOGLE_CLIENT_SECRET=your-secret python get_refresh_token.py
```

Sign in with the Google account that manages the profile. It prints a
**refresh token**. Then find your location:

```bash
GOOGLE_CLIENT_ID=your-id GOOGLE_CLIENT_SECRET=your-secret GOOGLE_REFRESH_TOKEN=your-token python agent.py --list-locations
```

Copy the value that looks like `accounts/123…/locations/456…`.

### 3. Get a Claude API key

Create one at <https://console.anthropic.com/settings/keys> and add some credit.
Each reply costs well under one cent.

### 4. Add the secrets to GitHub

In this repo: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Value |
| --- | --- |
| `ANTHROPIC_API_KEY` | from step 3 |
| `GOOGLE_CLIENT_ID` | from step 1 |
| `GOOGLE_CLIENT_SECRET` | from step 1 |
| `GOOGLE_REFRESH_TOKEN` | from step 2 |
| `GOOGLE_LOCATION` | from step 2, e.g. `accounts/123/locations/456` |
| `NOTIFY_TO` | the email address to send summaries to |
| `SMTP_HOST` | your email provider's SMTP server (Gmail: `smtp.gmail.com`, Microsoft 365: `smtp.office365.com`) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | the email address that sends the notifications |
| `SMTP_PASSWORD` | its password (Gmail needs an [app password](https://myaccount.google.com/apppasswords)) |

The email settings are optional, but without them you won't hear about the
reviews it holds back for you.

### 5. Test it, then switch it on

1. **Actions** tab → **Google review auto-responder** → **Run workflow** with
   *Dry run* ticked. Open the run log to read the replies it *would* have
   posted. Nothing is posted.
2. Happy with them? It's already scheduled. From now on it runs every day
   at 9pm (Melbourne daylight-saving time; 8pm in winter). To pause it, open the workflow on the Actions tab → **⋯ → Disable workflow**.

By default it only looks at reviews from the last 14 days, so it won't reply to
your whole back catalogue on the first run. To answer older unreplied reviews
once, set `MAX_AGE_DAYS` (e.g. `365`) in the workflow for a single run.

---

## Notes

- **Timing:** GitHub schedules run in UTC, so the 9pm run shifts to 8pm when
  daylight saving ends. To keep 9pm in winter, change the cron in
  `.github/workflows/review-agent.yml` to `0 11 * * *`. GitHub sometimes
  starts scheduled jobs a little late. A daily run uses about 30 of the 2,000
  free Actions minutes a month.
- **Running elsewhere:** it's a plain Python script. Set the same values as
  environment variables and run `python agent.py` from cron on any server.
- **Tests:** `pip install pytest && python -m pytest tests`
