import os
import re
import unittest
from tests.util_changed_files import filter_changed_markdown, repo_abspath

class TestMarkdownStructure(unittest.TestCase):
    def setUp(self):
        self.changed_md = filter_changed_markdown()
        # Only test docs/ markdowns here; PR templates are handled separately
        self.docs = [p for p in self.changed_md if p.startswith("docs/") and os.path.exists(repo_abspath(p))]

    def test_files_exist(self):
        for p in self.docs:
            with self.subTest(p=p):
                self.assertTrue(os.path.exists(repo_abspath(p)), f"Missing file: {p}")

    def test_no_tabs_or_crlf(self):
        for p in self.docs:
            with self.subTest(p=p):
                content = open(repo_abspath(p), "rb").read()
                self.assertNotIn(b"\t", content, "Tabs found (prefer spaces)")
                self.assertNotIn(b"\r\n", content, "CRLF found (prefer LF)")

    def test_no_trailing_whitespace(self):
        for p in self.docs:
            with self.subTest(p=p):
                lines = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read().splitlines()
                for i, line in enumerate(lines, start=1):
                    self.assertFalse(len(line) > 0 and line.endswith(" "), f"Trailing space at {p}:{i}")

    def test_max_line_length_ignoring_code_blocks(self):
        # Allow long lines in fenced code blocks; enforce <= 120 elsewhere
        for p in self.docs:
            with self.subTest(p=p):
                lines = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read().splitlines()
                in_code = False
                for i, line in enumerate(lines, start=1):
                    if line.strip().startswith("```"):
                        in_code = not in_code
                    if not in_code and len(line) > 120:
                        self.fail(f"Line too long (>120) at {p}:{i}")

    def test_docs_start_with_h1(self):
        # Most docs should begin with a top-level heading
        for p in self.docs:
            with self.subTest(p=p):
                text = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read().lstrip()
                lines = text.splitlines()
                first_line = lines[0] if lines else ""
                self.assertTrue(first_line.startswith("#"), f"Expected H1 heading at top of {p}")

    def test_eof_newline(self):
        for p in self.docs:
            with self.subTest(p=p):
                with open(repo_abspath(p), "rb") as f:
                    data = f.read()
                self.assertTrue(len(data) == 0 or data.endswith(b"\n"), f"File should end with newline: {p}")

if __name__ == "__main__":
    unittest.main()