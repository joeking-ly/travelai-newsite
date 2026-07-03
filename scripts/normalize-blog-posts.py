#!/usr/bin/env python3
"""Normalize imported blog HTML: prose layout, share icons, wider article."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent))
from blog_post_format import SHARE_SECTION_HTML, SITE_CSS_VERSION, normalize_article_content

ROOT = Path(__file__).resolve().parents[1]
BLOGS_DIR = ROOT / "blogs"


def normalize_file(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "lxml")

    body = soup.find("body")
    if body:
        classes = body.get("class", [])
        if "page-blog" not in classes:
            body["class"] = classes + ["page-blog"]

    for link in soup.select('link[href*="css/site.css"]'):
        link["href"] = f"../css/site.css?v={SITE_CSS_VERSION}"

    section = soup.select_one("section.section.white .article")
    if section:
        parent_section = section.find_parent("section")
        if parent_section:
            parent_section["class"] = ["section", "white", "article-section"]

    article = soup.select_one(".article")
    if not article:
        return False

    prose = article.select_one(".the-post-content, .article-prose")
    if prose:
        normalized = normalize_article_content(prose)
        prose.replace_with(normalized)

    share = soup.select_one("section.share")
    if share:
        new_share = BeautifulSoup(SHARE_SECTION_HTML, "lxml").select_one("section.share")
        share.replace_with(new_share)

    scripts = soup.find("body")
    if scripts and not soup.find("script", src=re.compile(r"blog-share\.js")):
        tag = soup.new_tag("script", src=f"../js/blog-share.js?v=1")
        footer = soup.find("footer")
        if footer:
            footer.insert_before(tag)
        else:
            scripts.append(tag)

    path.write_text(str(soup), encoding="utf-8")
    return True


def main() -> None:
    count = 0
    for path in sorted(BLOGS_DIR.glob("*.html")):
        if path.name == "insights-import-manifest.json":
            continue
        if normalize_file(path):
            count += 1
            print(f"Normalized {path.name}")
    print(f"Done: {count} posts")


if __name__ == "__main__":
    main()
