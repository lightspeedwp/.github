import os
import re
import unittest
from tests.util_changed_files import repo_abspath

UNRELEASED_SECTIONS = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"]

class TestChangelog(unittest.TestCase):
    def setUp(self):
        self.path = repo_abspath("CHANGELOG.md")
        self.skipTestIfMissing()

    def skipTestIfMissing(self):
        if not os.path.exists(self.path):
            self.skipTest("No CHANGELOG.md present")

    def test_top_header(self):
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        self.assertTrue(text.lstrip().startswith("# Changelog"), "CHANGELOG.md must start with '# Changelog'")

    def test_unreleased_section_and_categories(self):
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        m = re.search(r"^##\s+\[Unreleased\](.*?)(?=^##\s+\[|\Z)", text, flags=re.S | re.M)
        self.assertIsNotNone(m, "Missing 'Unreleased' section")
        block = m.group(1)
        for sec in UNRELEASED_SECTIONS:
            self.assertRegex(block, rf"^###\s+{sec}\s*$", f"Missing '### {sec}' under Unreleased")

    def test_has_versioned_release_with_date(self):
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        self.assertRegex(text, r"^##\s+\[\d+\.\d+\.\d+\]\s+-\s+\d{4}-\d{2}-\d{2}", "Expected a versioned release with date")

if __name__ == "__main__":
    unittest.main()