import os
import re
import unittest
from urllib.parse import urlparse
from tests.util_changed_files import filter_changed_markdown, repo_abspath

LINK_RX = re.compile(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")

class TestDocsLinks(unittest.TestCase):
    def setUp(self):
        """
        Prepare the list of changed Markdown files that actually exist in the repository.
        
        Sets `self.changed_md` to the result of `filter_changed_markdown()` and `self.md_files` to the subset whose resolved repository paths (via `repo_abspath`) exist on disk.
        """
        self.changed_md = filter_changed_markdown()
        self.md_files = [p for p in self.changed_md if os.path.exists(repo_abspath(p))]

    def test_links_well_formed_and_local_targets_exist(self):
        """
        Validate Markdown links in the collected changed files and assert that local targets exist.
        
        Iterates over each Markdown file prepared in setUp, finds Markdown-style links, skips anchors and mailto:/tel: URIs, and performs a basic sanity check for http/https links (ensures no spaces). For relative links it resolves the path against the file's directory and asserts the target file exists, causing the test to fail on any broken relative link.
        """
        for rel in self.md_files:
            with self.subTest(markdown=rel):
                text = open(repo_abspath(rel), "r", encoding="utf-8", errors="replace").read()
                basedir = os.path.dirname(repo_abspath(rel))
                for m in LINK_RX.finditer(text):
                    label, target = m.group(1), m.group(2)
                    # Skip anchors, mailto, and external http(s) links
                    if target.startswith("#") or target.startswith("mailto:") or target.startswith("tel:"):
                        continue
                    parsed = urlparse(target)
                    if parsed.scheme in ("http", "https", ""):
                        if parsed.scheme in ("http", "https"):
                            # Can't validate external links offline — only basic sanity
                            self.assertNotIn(" ", target, f"External link contains spaces: {rel} -> {target}")
                            continue
                        # Relative path — validate existence
                        local = target
                        if "#" in local:
                            local = local.split("#", 1)[0]
                        if not local:
                            # pure anchor in same doc handled above
                            continue
                        # Resolve relative to the current file
                        candidate = os.path.normpath(os.path.join(basedir, local))
                        self.assertTrue(os.path.exists(candidate), f"Broken relative link in {rel}: {target}")

if __name__ == "__main__":
    unittest.main()