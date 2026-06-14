#!/usr/bin/env python3
"""Add SEO meta tags, canonical URLs, and schema script to HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.travelai.com"

PAGE_META: dict[str, tuple[str, str]] = {
    "index.html": (
        "TravelAI – The Travel Memory Company | Travel Personalization in the Age of AI",
        "TravelAI is The Travel Memory Company – portable travel memory for travelers, governed memory for enterprises, while applying agentic AI across a network of 530+ travel brands.",
    ),
    "about.html": (
        "About TravelAI — Our Mission & Team",
        "Meet the team building The Travel Memory Company — portable memory for travelers, governed memory for enterprises, and AI across 530+ travel brands.",
    ),
    "platform.html": (
        "Platform — TravelAI Technology",
        "Explore TravelAI's platform: traveler.md portable memory, governed enterprise memory, and agentic AI that powers 530+ travel brands at scale.",
    ),
    "partners.html": (
        "Partners — TravelAI",
        "Partner with TravelAI to read and contribute to governed traveler memory — for suppliers, hotels, OTAs, and AI platforms building on a shared source of truth.",
    ),
    "why.html": (
        "Why TravelAI — Our Vision",
        "Why travel needs a memory layer: TravelAI's vision for portable traveler-owned context, enterprise governance, and agentic AI across the travel ecosystem.",
    ),
    "network.html": (
        "Network — TravelAI Agentic Travel Brands",
        "TravelAI's live agentic network of 530+ travel brands — production proof for portable memory, personalization, and sustainable travel AI at scale.",
    ),
    "contact.html": (
        "Contact TravelAI",
        "Get in touch with TravelAI about partnerships, platform access, press inquiries, and building on governed travel memory infrastructure.",
    ),
    "careers.html": (
        "Careers at TravelAI",
        "Join TravelAI and help build The Travel Memory Company — engineering, product, design, and growth roles shaping the future of travel AI.",
    ),
    "insights.html": (
        "Insights — TravelAI Blog & Research",
        "Travel AI insights, industry analysis, and research on personalization, agentic travel, memory infrastructure, and the future of travel technology.",
    ),
    "resources.html": (
        "Resources — TravelAI Press Kit & Documentation",
        "TravelAI press kit, brand assets, company information, FAQs, and resources for media, partners, and developers.",
    ),
    "stories.html": (
        "Travel Stories — TravelAI",
        "Real travel stories powered by AI personalization — curated journeys, itineraries, and inspiration from the TravelAI network.",
    ),
    "case-studies.html": (
        "Case Studies — TravelAI",
        "TravelAI case studies: how travel brands use agentic AI, personalization, and memory infrastructure to drive growth and better traveler experiences.",
    ),
    "privacy.html": (
        "Privacy Policy — TravelAI",
        "TravelAI privacy policy — how we collect, use, and protect personal information across our travel memory platform and network of brands.",
    ),
    "terms.html": (
        "Terms of Service — TravelAI",
        "TravelAI terms of service governing use of our website, platform, and travel memory products and services.",
    ),
    "blog-detail.html": (
        "Blog — TravelAI",
        "TravelAI blog article on AI, travel technology, personalization, and the future of intelligent travel experiences.",
    ),
}

SEO_BLOCK_TEMPLATE = """
  <meta name="description" content="{description}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="{og_type}" />
  <meta property="og:site_name" content="TravelAI" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
"""

SCHEMA_SCRIPT = '<script src="{prefix}js/seo-schema.js?v=1" defer></script>'


def url_path_for(file_path: Path) -> str:
    rel = file_path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    return "/" + rel


def title_from_html(html: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", html, re.I)
    return m.group(1).strip() if m else "TravelAI"


def description_from_title(title: str) -> str:
    clean = re.sub(r"\s*[—–-]\s*TravelAI.*$", "", title, flags=re.I).strip()
    return f"{clean} — insights on AI, travel technology, and personalization from TravelAI."


def strip_existing_seo(html: str) -> str:
    patterns = [
        r'\n\s*<meta name="description"[^>]*>',
        r'\n\s*<meta name="robots"[^>]*>',
        r'\n\s*<link rel="canonical"[^>]*>',
        r'\n\s*<meta property="og:[^"]+"[^>]*>',
        r'\n\s*<meta name="twitter:[^"]+"[^>]*>',
        r'\n\s*<meta name="article:[^"]+"[^>]*>',
        r'\n\s*<script src="[^"]*seo-schema\.js[^"]*"[^>]*></script>',
    ]
    for pat in patterns:
        html = re.sub(pat, "", html, flags=re.I)
    return html


def prefix_for(file_path: Path) -> str:
    depth = len(file_path.relative_to(ROOT).parts) - 1
    return "../" * depth if depth else ""


def inject_seo(html: str, file_path: Path) -> str:
    html = strip_existing_seo(html)
    rel_name = file_path.name
    rel_posix = file_path.relative_to(ROOT).as_posix()

    if rel_name in PAGE_META:
        title, description = PAGE_META[rel_name]
    elif rel_posix.startswith("blogs/"):
        title = title_from_html(html)
        description = description_from_title(title)
    elif rel_posix.startswith("stories/"):
        title = title_from_html(html)
        description = description_from_title(title)
    else:
        title = title_from_html(html)
        description = f"{title} — TravelAI, The Travel Memory Company."

    canonical = SITE + url_path_for(file_path)
    og_type = "article" if rel_posix.startswith("blogs/") else "website"
    prefix = prefix_for(file_path)

    block = SEO_BLOCK_TEMPLATE.format(
        title=_esc(title),
        description=_esc(description),
        canonical=canonical,
        og_type=og_type,
    ).strip()

    if rel_posix.startswith("blogs/"):
        block += '\n  <meta name="article:type" content="BlogPosting" />'

    if not re.search(r'<meta charset=', html, re.I):
        return html

    html = re.sub(
        r'(<meta name="viewport"[^>]*>)',
        r"\1\n" + block,
        html,
        count=1,
        flags=re.I,
    )

    schema = SCHEMA_SCRIPT.format(prefix=prefix)
    if "seo-schema.js" not in html:
        html = re.sub(
            r"(<script src=\"[^\"]*universal-nav\.js[^\"]*\"></script>)",
            schema + r"\n\1",
            html,
            count=1,
        )
        if "seo-schema.js" not in html:
            html = html.replace("</body>", schema + "\n</body>")

    return html


def _esc(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace('"', "&quot;")
        .replace("<", "&lt;")
    )


def main() -> None:
    updated = 0
    for path in sorted(ROOT.rglob("*.html")):
        if "network-redesign" in path.name or "journey-section" in path.name or "drives-section" in path.name:
            continue
        original = path.read_text(encoding="utf-8")
        new = inject_seo(original, path)
        if new != original:
            path.write_text(new, encoding="utf-8")
            updated += 1
            print(f"updated: {path.relative_to(ROOT)}")
    print(f"Done. Updated {updated} files.")


if __name__ == "__main__":
    main()
