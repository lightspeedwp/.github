import os
import re
import unittest
from tests.util_changed_files import filter_changed_markdown, repo_abspath

class TestRemovedExamplesReferences(unittest.TestCase):
    def test_no_examples_path_references_in_changed_docs(self):
        # The examples/ directory was removed; ensure docs don't point to it anymore
        for rel in filter_changed_markdown():
            if not os.path.exists(repo_abspath(rel)):
                continue
            if not rel.endswith(".md"):
                continue
            with self.subTest(doc=rel):
                text = open(repo_abspath(rel), "r", encoding="utf-8", errors="replace").read()
                self.assertNotRegex(text, r"\bexamples/", f"Stale 'examples/' reference in {rel}")

if __name__ == "__main__":
    unittest.main()