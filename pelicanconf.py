from __future__ import annotations

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

DEFAULT_PAGINATION = False
RELATIVE_URLS = True

# Disable feeds during local development
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None

