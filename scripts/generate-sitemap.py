#!/usr/bin/env python3
"""Generate sitemap.xml for TravelAI static site."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.travelai.com"
SKIP = {"network-redesign.html", "journey-section.html", "drives-section.html", "blog-detail.html"}

urls: list[str] = []
for path in sorted(ROOT.rglob("*.html")):
    if path.name in SKIP:
        continue
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        urls.append(SITE + "/")
    else:
        urls.append(SITE + "/" + rel)

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
for url in urls:
    lines.append("  <url>")
    lines.append(f"    <loc>{url}</loc>")
    lines.append("  </url>")
lines.append("</urlset>")
lines.append("")

(ROOT / "sitemap.xml").write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote sitemap.xml with {len(urls)} URLs")
