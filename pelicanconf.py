from __future__ import annotations

import json
from pathlib import Path

AUTHOR = "Arnav Kalekar"
SITENAME = "Arnav Kalekar"
SITEURL = ""

PATH = "content"
TIMEZONE = "America/New_York"
DEFAULT_LANG = "en"

THEME = "theme"

PAGE_URL = "{slug}.html"
PAGE_SAVE_AS = "{slug}.html"

ARTICLE_URL = "blog/{slug}.html"
ARTICLE_SAVE_AS = "blog/{slug}.html"

INDEX_SAVE_AS = "blog/index.html"
ARCHIVES_SAVE_AS = "blog/archives/index.html"
TAG_SAVE_AS = "blog/tag/{slug}.html"
CATEGORY_SAVE_AS = "blog/category/{slug}.html"
AUTHOR_SAVE_AS = "blog/author/{slug}.html"

STATIC_PATHS = [
    "assets",
    "notes",
]

# Expose CV data (JSON) to Jinja templates
def _load_cv_data() -> dict | None:
    try:
        cv_path = Path(__file__).parent / "content" / "assets" / "json" / "resume.json"
        if cv_path.exists():
            return json.loads(cv_path.read_text(encoding="utf-8"))
    except Exception:
        return None
    return None

cv_data = _load_cv_data()

JINJA_GLOBALS = {"cv_data": cv_data}

# Markdown configuration to allow class hooks without raw HTML
MARKDOWN = {
    "extensions": [
        "markdown.extensions.attr_list",
        "markdown.extensions.md_in_html",
    ],
    "extension_configs": {},
}

DEFAULT_PAGINATION = False
RELATIVE_URLS = True

# Disable feeds during local development
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None

