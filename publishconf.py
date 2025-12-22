from __future__ import annotations

import os
import sys

sys.path.append(os.curdir)
from pelicanconf import *  # noqa: F401,F403

SITEURL = os.getenv("SITEURL", "")
RELATIVE_URLS = False

# Feeds can be enabled for production if desired
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"

