#!/usr/bin/env python3
"""Import curated insights posts from travelai.com into blogs/ + insights.html."""

from __future__ import annotations

import json
import re
import time
import html
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlsplit, urlunsplit, quote

from bs4 import BeautifulSoup, Tag

from blog_post_format import SHARE_SECTION_HTML, SITE_CSS_VERSION, normalize_article_content

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "content-export" / "insights-blog-links.md"
BLOGS_DIR = ROOT / "blogs"
ASSETS_BLOG = ROOT / "assets" / "blog"
INSIGHTS_HTML = ROOT / "insights.html"

FEATURED_SLUG = "travel-trends-podcast-agentic-ai"
FEATURED_URL = "https://www.travelai.com/resources/travel-trends-podcast-agentic-ai/"

INSIGHT_CATEGORIES = frozenset(
    {"Company", "Inspiration", "Industry", "Community Contributions", "Podcast"}
)

SECTION_CATEGORY = {
    "company / travelai news": "Company",
    "inspiration / thesis & thought leadership": "Inspiration",
    "industry analysis": "Industry",
    "community contributions (interview / guest series)": "Community Contributions",
    "podcast": "Podcast",
}

UA = "Mozilla/5.0 (compatible; TravelAI-site-import/1.0)"
FETCH_DELAY = 1.0


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def encode_url(url: str) -> str:
    parts = urlsplit(url)
    path = quote(parts.path, safe="/%")
    return urlunsplit((parts.scheme, parts.netloc, path, parts.query, parts.fragment))


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    safe_url = encode_url(url)
    try:
        req = urllib.request.Request(safe_url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.write_bytes(resp.read())
        return True
    except Exception as exc:
        print(f"  ! image download failed: {url} ({exc})")
        return False


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/")
    return path.split("/")[-1]


def parse_md() -> list[dict]:
    text = MD_PATH.read_text(encoding="utf-8")
    posts: list[dict] = []
    section = ""
    for line in text.splitlines():
        if line.startswith("## "):
            section = line[3:].strip().lower()
            continue
        m = re.match(r"^- \[(.+?)\]\((https://www\.travelai\.com/resources/[^)]+)\)", line)
        if not m:
            continue
        title, url = m.group(1), m.group(2)
        extra: list[str] = []
        tag_m = re.search(r"_\(tagged ([^)]+)\)_", line)
        if tag_m:
            extra = [t.strip() for t in tag_m.group(1).split(",")]
        primary = SECTION_CATEGORY.get(section, "Industry")
        posts.append(
            {
                "title": title,
                "url": url,
                "slug": slug_from_url(url),
                "primary_category": primary,
                "extra_tags": extra,
            }
        )

    slugs = {p["slug"] for p in posts}
    if FEATURED_SLUG not in slugs:
        posts.insert(
            0,
            {
                "title": "Agentic AI in Travel: From Conversation to Action",
                "url": FEATURED_URL,
                "slug": FEATURED_SLUG,
                "primary_category": "Podcast",
                "extra_tags": ["Company"],
            },
        )
    return posts


def parse_yoast(html_text: str) -> dict:
    m = re.search(
        r'<script type="application/ld\+json" class="yoast-schema-graph">(.*?)</script>',
        html_text,
        re.S,
    )
    if not m:
        return {}
    data = json.loads(m.group(1))
    article = next((n for n in data.get("@graph", []) if n.get("@type") == "Article"), {})
    meta_desc = ""
    dm = re.search(r'<meta name="description" content="([^"]*)"', html_text)
    if dm:
        meta_desc = html.unescape(dm.group(1))
    read_time = ""
    tm = re.search(r'<meta name="twitter:data2" content="([^"]*)"', html_text)
    if tm:
        read_time = tm.group(1)
    return {
        "headline": article.get("headline", ""),
        "description": meta_desc,
        "author": (article.get("author") or {}).get("name", "TravelAI Team"),
        "date_published": article.get("datePublished", ""),
        "date_modified": article.get("dateModified", ""),
        "sections": article.get("articleSection", []) or [],
        "thumbnail": article.get("thumbnailUrl", ""),
        "word_count": article.get("wordCount", 0),
        "read_time": read_time,
    }


def insight_tags(primary: str, extra: list[str], sections: list[str]) -> list[str]:
    tags: list[str] = []
    for candidate in [primary, *extra, *sections]:
        if candidate in INSIGHT_CATEGORIES and candidate not in tags:
            tags.append(candidate)
    if not tags:
        tags = [primary] if primary in INSIGHT_CATEGORIES else ["Industry"]
    return tags


def format_date(iso: str) -> str:
    if not iso:
        return ""
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%b %d, %Y")
    except ValueError:
        return iso[:10]


def initials(name: str) -> str:
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    if not parts:
        return "TA"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def ext_from_url(url: str) -> str:
    path = urlparse(url).path
    ext = Path(path).suffix.lower()
    return ext if ext in {".jpg", ".jpeg", ".png", ".webp", ".gif"} else ".jpg"


def process_content(content: Tag, slug: str) -> tuple[str, list[str]]:
    downloaded: list[str] = []
    asset_dir = ASSETS_BLOG / slug
    idx = 0
    for img in content.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src or src.startswith("data:"):
            img.decompose()
            continue
        src = urljoin("https://www.travelai.com/", src)
        idx += 1
        ext = ext_from_url(src)
        fname = f"inline-{idx:02d}{ext}"
        dest = asset_dir / fname
        if download(src, dest):
            img["src"] = f"../assets/blog/{slug}/{fname}"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
            downloaded.append(str(dest.relative_to(ROOT)))
        else:
            img.decompose()

    for tag in content.find_all(["script", "style", "form", "button"]):
        tag.decompose()

    for a in content.find_all("a", href=True):
        href = a["href"]
        if href.startswith("https://www.travelai.com/"):
            a["href"] = href
        elif href.startswith("/"):
            a["href"] = "https://www.travelai.com" + href

    normalize_article_content(content)
    return str(content), downloaded


def extract_body(html_text: str, slug: str) -> tuple[str, str]:
    soup = BeautifulSoup(html_text, "lxml")
    content = soup.select_one(".the-post-content") or soup.select_one(".post-content")
    if not content:
        return "<p>Content unavailable.</p>", ""

    excerpt_p = content.find("p")
    excerpt = excerpt_p.get_text(" ", strip=True)[:220] if excerpt_p else ""

    body_html, _ = process_content(content, slug)
    return body_html, excerpt


def import_post(entry: dict) -> dict | None:
    url = entry["url"]
    slug = entry["slug"]
    print(f"Importing {slug} ...")
    try:
        page = fetch(url)
    except Exception as exc:
        print(f"  ! fetch failed: {exc}")
        return None

    meta = parse_yoast(page)
    title = meta.get("headline") or entry["title"]
    tags = insight_tags(entry["primary_category"], entry["extra_tags"], meta.get("sections", []))
    body_html, excerpt = extract_body(page, slug)
    if not excerpt:
        excerpt = meta.get("description", "")[:220]

    hero_url = meta.get("thumbnail") or ""
    hero_rel = ""
    if hero_url:
        ext = ext_from_url(hero_url)
        hero_path = ASSETS_BLOG / slug / f"hero{ext}"
        if download(hero_url, hero_path):
            hero_rel = f"../assets/blog/{slug}/hero{ext}"

    read_time = meta.get("read_time") or ""
    if not read_time and meta.get("word_count"):
        mins = max(1, round(int(meta["word_count"]) / 200))
        read_time = f"{mins} min read"

    return {
        "slug": slug,
        "url": url,
        "title": title,
        "excerpt": excerpt,
        "description": meta.get("description") or excerpt,
        "author": meta.get("author") or "TravelAI Team",
        "author_initials": initials(meta.get("author") or "TravelAI Team"),
        "date_iso": meta.get("date_published", ""),
        "date_display": format_date(meta.get("date_published", "")),
        "read_time": read_time,
        "tags": tags,
        "data_category": "|".join(tags),
        "hero_rel": hero_rel,
        "body_html": body_html,
        "primary_category": entry["primary_category"],
    }


def hero_style(hero_rel: str) -> str:
    if not hero_rel:
        return ""
  # listing pages use path from site root; article pages use ../assets
    return f' style="background-image:url({hero_rel})"'


def listing_hero_style(slug: str, hero_rel: str) -> str:
    if not hero_rel:
        return ""
    path = hero_rel.replace("../", "")
    return f' style="background-image:url({path});background-size:cover;background-position:center"'


def render_blog(post: dict) -> str:
    tags_html = "\n".join(f'        <span class="hero-tag">{html.escape(t)}</span>' for t in post["tags"])
    read_bit = f" • {html.escape(post['read_time'])}" if post.get("read_time") else ""
    hero_img = ""
    if post.get("hero_rel"):
        hero_img = (
            f'      <div class="article-img has-image" style="background-image:url({post["hero_rel"]});'
            'background-size:cover;background-position:center"></div>\n'
        )
    else:
        hero_img = '      <div class="article-img"></div>\n'

    desc = html.escape(post["description"][:300])
    title_esc = html.escape(post["title"])
    canonical = f"https://www.travelai.com/blogs/{post['slug']}.html"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="{desc}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="TravelAI" />
  <meta property="og:title" content="{title_esc} — TravelAI Insights" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title_esc} — TravelAI Insights" />
  <meta name="twitter:description" content="{desc}" />
  <meta name="article:type" content="BlogPosting" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <title>{title_esc} — TravelAI Insights</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/universal-nav.css?v=14">
  <link rel="stylesheet" href="../css/motion-reveal.css?v=2">
  <link rel="stylesheet" href="../css/site.css?v={SITE_CSS_VERSION}">
</head>
<body class="page-blog">
  <div id="universal-nav-placeholder"></div>

  <section class="hero">
    <div class="hero-inner">
      <a href="../insights.html" class="back-link">← Back to Insights</a>
      <div class="hero-tags">
{tags_html}
      </div>
      <h1 class="hero-title">{title_esc}</h1>
      <p class="hero-excerpt">{html.escape(post["excerpt"])}</p>
      <div class="hero-meta">
        <div class="author-avatar">{html.escape(post["author_initials"])}</div>
        <div class="author-info">
          <div class="author-name">{html.escape(post["author"])}</div>
          <div class="meta-details">Published {html.escape(post["date_display"])}{read_bit}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section white article-section">
    <div class="article">
{hero_img}{post["body_html"]}
    </div>
  </section>

{SHARE_SECTION_HTML}

  <footer>
    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">
          <a href="../index.html"><img src="../assets/White%20Logo%20Horizontal%20Transparent.svg" alt="TravelAI" class="footer-logo-img"></a>
        </div>
        <p class="footer-tagline">Making travel better through AI personalization.</p>
      </div>
      <div class="footer-col"><h5>Product</h5><ul><li><a href="../platform.html">Platform</a></li><li><a href="../network.html">Network</a></li><li><a href="../case-studies.html">Case Studies</a></li><li><a href="../partners.html">Partners</a></li></ul></div>
      <div class="footer-col"><h5>Company</h5><ul><li><a href="../our-vision.html">Our Vision</a></li><li><a href="../about.html">About Us</a></li><li><a href="../careers.html">Careers</a></li><li><a href="../contact.html">Contact</a></li></ul></div>
      <div class="footer-col"><h5>Content</h5><ul><li><a href="../insights.html">Insights</a></li><li><a href="../resources.html">Resources</a></li><li><a href="../stories.html">Travel Stories</a></li></ul></div>
      <div class="footer-col"><h5>Legal</h5><ul><li><a href="../privacy.html">Privacy Policy</a></li><li><a href="../terms.html">Terms of Service</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span class="footer-legal">© 2026 TravelAI. All rights reserved.</span>
      <div class="social-links"><a href="#">𝕏</a><a href="#">in</a><a href="#">f</a><a href="#">◎</a></div>
    </div>
  </footer>
  <script src="../js/seo-schema.js?v=1" defer></script>
  <script src="../js/universal-nav.js?v=8"></script>
  <script src="../js/scroll-reveal.js?v=2"></script>
  <script src="../js/blog-share.js?v=1"></script>
</body>
</html>
"""


def render_card(post: dict) -> str:
    tags = "\n".join(
        f'            <span class="story-tag">{html.escape(t)}</span>' for t in post["tags"][:2]
    )
    img_style = listing_hero_style(post["slug"], post.get("hero_rel", ""))
    return f"""        <a href="blogs/{post["slug"]}.html" class="story-card" style="display:block;color:inherit;text-decoration:none;" data-category="{html.escape(post["data_category"])}">
          <div class="story-img has-image"{img_style}></div>
          <div class="story-content">
            <div class="story-tags">{tags}</div>
            <h3 class="story-title">{html.escape(post["title"])}</h3>
            <p class="story-excerpt">{html.escape(post["excerpt"])}</p>
            <div class="story-meta">
              <div class="story-avatar">{html.escape(post["author_initials"])}</div>
              <div>
                <div class="story-author">{html.escape(post["author"])}</div>
                <div class="story-date">{html.escape(post["date_display"])}</div>
              </div>
            </div>
          </div>
        </a>"""


def render_insights(posts: list[dict], featured: dict) -> str:
    f_tags = "\n".join(f'            <span class="tag">{html.escape(t)}</span>' for t in featured["tags"])
    f_img = listing_hero_style(featured["slug"], featured.get("hero_rel", ""))

    grid_posts = [p for p in posts if p["slug"] != featured["slug"]]
    grid_posts.sort(key=lambda p: p.get("date_iso", ""), reverse=True)
    cards = "\n".join(render_card(p) for p in grid_posts)

    filters = [
        "All",
        "Company",
        "Inspiration",
        "Industry",
        "Community Contributions",
        "Podcast",
    ]
    filter_btns = "\n".join(
        f'            <button type="button" class="filter-btn{" active" if f == "All" else ""}" data-filter="{f}">{f}</button>'
        for f in filters
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="Travel AI insights, industry analysis, and research on personalization, agentic travel, memory infrastructure, and the future of travel technology." />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://www.travelai.com/insights.html" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TravelAI" />
  <meta property="og:title" content="Insights — TravelAI Blog &amp; Research" />
  <meta property="og:description" content="Travel AI insights, industry analysis, and research on personalization, agentic travel, memory infrastructure, and the future of travel technology." />
  <meta property="og:url" content="https://www.travelai.com/insights.html" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Insights — TravelAI Blog &amp; Research" />
  <meta name="twitter:description" content="Travel AI insights, industry analysis, and research on personalization, agentic travel, memory infrastructure, and the future of travel technology." />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <title>Insights — TravelAI Insights &amp; Updates</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/universal-nav.css?v=14">
  <link rel="stylesheet" href="css/motion-reveal.css?v=2">
  <link rel="stylesheet" href="css/site.css?v=40">
</head>
<body class="page-insights">
  <div id="universal-nav-placeholder"></div>

  <section class="hero">
    <h1 class="hero-title">The future of<br/><span class="gradient">travel intelligence</span></h1>
    <p class="hero-subtitle">Perspectives on AI, personalization, and the evolution of travel from the team building the industry's most advanced travel agentic network.</p>
  </section>

  <section class="section dark">
    <div class="inner">

      <div class="featured" id="blog-featured" data-category="{html.escape(featured["data_category"])}">
        <div class="featured-img has-image"{f_img}></div>
        <div class="featured-content">
          <div class="featured-label">Featured Post</div>
          <h2 class="featured-title">{html.escape(featured["title"])}</h2>
          <div class="featured-tags">
{f_tags}
          </div>
          <p class="featured-excerpt">{html.escape(featured["excerpt"])}</p>
          <div class="featured-meta">
            <div class="author-avatar">{html.escape(featured["author_initials"])}</div>
            <div>
              <div class="author-name">{html.escape(featured["author"])}</div>
              <div class="author-date">{html.escape(featured["date_display"])}</div>
            </div>
          </div>
          <a href="blogs/{featured["slug"]}.html" class="featured-cta">Read Full Post</a>
        </div>
      </div>

      <div class="filters-sticky-bar" id="insights-filters-sticky-bar">
        <div class="filters-sticky-spacer" id="insights-filters-spacer"></div>
        <div class="filters-bar-content">
          <div class="inner"><div class="filters">
{filter_btns}
          </div></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section white">
    <div class="inner">
      <h3 class="stories-title" style="color:#0A0A0F">Latest Posts</h3>

      <div id="blog-stories-grid" class="stories-grid">
{cards}
      </div>

      <div id="blog-no-results" class="blog-no-results">No posts in this category yet.</div>

    </div>
  </section>

  <footer>
    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">
          <a href="index.html"><img src="assets/White%20Logo%20Horizontal%20Transparent.svg" alt="TravelAI" class="footer-logo-img"></a>
        </div>
        <p class="footer-tagline">Making travel better through AI personalization.</p>
      </div>
      <div class="footer-col"><h5>Product</h5><ul><li><a href="platform.html">Platform</a></li><li><a href="network.html">Network</a></li><li><a href="case-studies.html">Case Studies</a></li><li><a href="partners.html">Partners</a></li></ul></div>
      <div class="footer-col"><h5>Company</h5><ul><li><a href="our-vision.html">Our Vision</a></li><li><a href="about.html">About Us</a></li><li><a href="careers.html">Careers</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div class="footer-col"><h5>Content</h5><ul><li><a href="insights.html">Insights</a></li><li><a href="resources.html">Resources</a></li><li><a href="stories.html">Travel Stories</a></li></ul></div>
      <div class="footer-col"><h5>Legal</h5><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Service</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span class="footer-legal">© 2026 TravelAI. All rights reserved.</span>
      <div class="social-links"><a href="#">𝕏</a><a href="#">in</a><a href="#">f</a><a href="#">◎</a></div>
    </div>
  </footer>
  <script src="js/easemize-glow-cards.js?v=1"></script>
  <script src="js/seo-schema.js?v=1" defer></script>
  <script src="js/universal-nav.js?v=8"></script>
  <script src="js/scroll-reveal.js?v=2"></script>
  <script>
  (function() {{
    var filterBtns = document.querySelectorAll('.filter-btn');
    var featured = document.getElementById('blog-featured');
    var grid = document.getElementById('blog-stories-grid');
    var cards = grid ? grid.querySelectorAll('.story-card') : [];
    var noResults = document.getElementById('blog-no-results');

    function hasCategory(el, filter) {{
      if (!el || !filter || filter === 'All') return true;
      var cat = el.getAttribute('data-category') || '';
      var categories = cat.split('|').map(function(s) {{ return s.trim(); }});
      return categories.indexOf(filter) !== -1;
    }}

    function applyFilter(filter) {{
      if (featured) {{
        if (filter === 'All' || hasCategory(featured, filter)) {{
          featured.classList.remove('blog-hidden');
        }} else {{
          featured.classList.add('blog-hidden');
        }}
      }}

      var visibleCount = 0;
      cards.forEach(function(card) {{
        if (hasCategory(card, filter)) {{
          card.classList.remove('blog-hidden');
          visibleCount++;
        }} else {{
          card.classList.add('blog-hidden');
        }}
      }});

      if (noResults) {{
        noResults.classList.toggle('visible', visibleCount === 0 && (!featured || featured.classList.contains('blog-hidden')));
      }}
    }}

    filterBtns.forEach(function(btn) {{
      btn.addEventListener('click', function() {{
        var filter = this.getAttribute('data-filter') || 'All';
        filterBtns.forEach(function(b) {{ b.classList.remove('active'); }});
        this.classList.add('active');
        applyFilter(filter);
      }});
    }});
  }})();
  (function() {{
    var NAV_H = 72;
    var bar = document.getElementById('insights-filters-sticky-bar');
    var spacer = document.getElementById('insights-filters-spacer');
    var barContent = bar ? bar.querySelector('.filters-bar-content') : null;
    if (!bar || !spacer || !barContent) return;
    function updateStuck() {{
      var barTop = bar.getBoundingClientRect().top;
      if (barTop <= NAV_H) {{
        bar.classList.add('is-stuck');
        spacer.style.height = barContent.offsetHeight + 'px';
      }} else {{
        bar.classList.remove('is-stuck');
        spacer.style.height = '0';
      }}
    }}
    window.addEventListener('scroll', updateStuck, {{ passive: true }});
    window.addEventListener('resize', updateStuck);
    updateStuck();
  }})();
  </script>
</body>
</html>
"""


def cleanup_old_blogs(keep_slugs: set[str]) -> None:
    for path in BLOGS_DIR.glob("*.html"):
        if path.stem not in keep_slugs:
            print(f"Removing {path.name}")
            path.unlink()


def main() -> None:
    entries = parse_md()
    print(f"Found {len(entries)} posts in manifest")

    imported: list[dict] = []
    failed: list[str] = []

    for i, entry in enumerate(entries):
        post = import_post(entry)
        if post:
            BLOGS_DIR.mkdir(exist_ok=True)
            out = BLOGS_DIR / f"{post['slug']}.html"
            out.write_text(render_blog(post), encoding="utf-8")
            imported.append(post)
        else:
            failed.append(entry["slug"])
        if i < len(entries) - 1:
            time.sleep(FETCH_DELAY)

    if not imported:
        raise SystemExit("No posts imported.")

    featured = next((p for p in imported if p["slug"] == FEATURED_SLUG), imported[0])
    INSIGHTS_HTML.write_text(render_insights(imported, featured), encoding="utf-8")

    cleanup_old_blogs({p["slug"] for p in imported})

    manifest = ROOT / "blogs" / "insights-import-manifest.json"
    manifest.write_text(
        json.dumps(
            {
                "imported": len(imported),
                "failed": failed,
                "featured": FEATURED_SLUG,
                "slugs": [p["slug"] for p in imported],
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"\nDone: {len(imported)} posts imported, {len(failed)} failed.")
    if failed:
        print("Failed slugs:", ", ".join(failed))


if __name__ == "__main__":
    main()
