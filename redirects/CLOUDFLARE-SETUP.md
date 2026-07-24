# Cloudflare redirect setup for travelai.com

Apache (`.htaccess` at the site root) already handles everything at the origin:
clean URLs (`.html` stripped), old-page renames, and all 123 old blog redirects.
Because Cloudflare proxies requests to the origin, the site works with **no
Cloudflare rules at all** — Apache's 301s pass straight through.

Setting the same redirects up in Cloudflare as well makes them faster (they get
answered at the edge without hitting the server) and keeps them working even if
the origin config is ever lost. Here's how.

---

## 1. Dynamic rule: strip `.html` (Single Redirects)

Dashboard → your zone → **Rules → Redirect Rules → Create rule**.

- **Rule name:** `Strip .html extension`
- **If incoming requests match:** Wildcard pattern
  - Request URL: `https://www.travelai.com/*.html`
- **Then:** Dynamic redirect
  - Expression: `concat("https://www.travelai.com/", ${1})`
  - Status code: `301`
  - Preserve query string: **on**

With wildcard placeholders, `${1}` captures the path before `.html`, so
`/about.html` → `/about` and `/blogs/foo.html` → `/blogs/foo`.

Note: `/index.html` → `/index` would then be served by Apache's rewrite as the
homepage file; if you want `/index.html` to land exactly on `/`, add a static
rule above this one: `https://www.travelai.com/index.html` → `https://www.travelai.com/`.

## 2. Static rules: old top-level pages (Single Redirects)

Create one static redirect rule (301, preserve query string off) for each:

| Old URL | New URL |
|---|---|
| `/about-us` | `/about` |
| `/our-brands` | `/partners` |
| `/applied-ai` | `/network` |
| `/contact-us` | `/contact` |
| `/privacy-policy` | `/privacy` |
| `/site-terms` | `/terms` |

Tip: to catch both `/about-us` and `/about-us/` in one rule, use a wildcard
pattern `https://www.travelai.com/about-us*` (and so on for each).

## 3. Bulk Redirects: old blog posts

Dashboard → **Account Home → Bulk Redirects**:

1. **Create a bulk redirect list** (e.g. `old-resources-posts`) and upload
   `cloudflare-bulk-redirects.csv` from this folder.
   It contains 260 entries: every old `/resources/<slug>/` post URL (with and
   without trailing slash) → its new `/blogs/<slug>` page, plus the old
   top-level pages. Posts that were never migrated point at `/insights`.
2. **Create a bulk redirect rule** that enables the list, and deploy it.

Plan limits: Free accounts get 20 bulk-redirect edge rules / small list quotas;
Pro 500 URLs; Business+ more. If the list won't fit your plan, skip Bulk
Redirects — the Apache rules already cover every URL, so nothing breaks.

## 4. Catch-all for everything else under `/resources/`

Create a **last-priority** Single Redirect rule so old category/tag/author and
unmigrated URLs never 404 at the edge:

- **If:** Wildcard pattern, Request URL: `https://www.travelai.com/resources/*`
- **Then:** Static redirect to `https://www.travelai.com/insights`, `301`

Order matters: Bulk Redirects run before Single Redirects, so the specific
post mappings win and this catch-all only handles the leftovers.

**Important:** the pattern must include `/resources/*` **with the trailing
slash + wildcard**, not `/resources*` — the new site has its own Resources
page (press kit) living at `/resources`, which must keep working.

---

## Verification checklist (after deploy)

```bash
curl -sI https://www.travelai.com/about.html | grep -i location          # -> /about
curl -sI https://www.travelai.com/about-us | grep -i location            # -> /about
curl -sI https://www.travelai.com/resources/travel-trends-travelai/ | grep -i location   # -> /blogs/travel-trends-travelai
curl -sI https://www.travelai.com/resources/ai-travel-chatbot/ | grep -i location        # -> /insights (unmigrated)
curl -sI https://www.travelai.com/resources/category/anything | grep -i location         # -> /insights
curl -s -o /dev/null -w '%{http_code}' https://www.travelai.com/resources               # -> 200 (new press-kit page)
```
