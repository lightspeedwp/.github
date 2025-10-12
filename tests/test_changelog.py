import os
import re
import unittest
from tests.util_changed_files import repo_abspath

UNRELEASED_SECTIONS = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"]

class TestChangelog(unittest.TestCase):
    def setUp(self):
        """
        Prepare the test fixture by locating the repository CHANGELOG.md and skipping tests if it is absent.
        
        Sets `self.path` to the absolute path of the repository's CHANGELOG.md. If the file is not present, the test is skipped by calling `skipTestIfMissing`.
        """
        self.path = repo_abspath("CHANGELOG.md")
        self.skipTestIfMissing()

    def skipTestIfMissing(self):
        """
        Skip the test when the repository's CHANGELOG.md is not present.
        """
        if not os.path.exists(self.path):
            self.skipTest("No CHANGELOG.md present")

    def test_top_header(self):
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        self.assertTrue(text.lstrip().startswith("# Changelog"), "CHANGELOG.md must start with '# Changelog'")

    def test_unreleased_section_and_categories(self):
        """
        Verify the CHANGELOG contains an "Unreleased" section and that it includes the required "### <Section>" subsections.
        
        Checks that a top-level "## [Unreleased]" block is present and that each name in UNRELEASED_SECTIONS appears as a "### <Name>" header; the test fails if the Unreleased block or any expected subsection is missing.
        """
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        m = re.search(r"^##\s+\[Unreleased\](.*?)(?=^##\s+\[|\Z)", text, flags=re.S | re.M)
        self.assertIsNotNone(m, "Missing 'Unreleased' section")
        block = m.group(1)
        for sec in UNRELEASED_SECTIONS:
            self.assertRegex(block, rf"^###\s+{sec}\s*$", f"Missing '### {sec}' under Unreleased")

    def test_has_versioned_release_with_date(self):
        """
        Verify the changelog contains at least one versioned release header with a date.
        
        Asserts that the file includes a header of the form `## [X.Y.Z] - YYYY-MM-DD`; the test fails with "Expected a versioned release with date" if no such header is found.
        """
        text = open(self.path, "r", encoding="utf-8", errors="replace").read()
        self.assertRegex(text, r"^##\s+\[\d+\.\d+\.\d+\]\s+-\s+\d{4}-\d{2}-\d{2}", "Expected a versioned release with date")

if __name__ == "__main__":
    unittest.main()