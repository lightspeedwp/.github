import os
import re
import unittest
from tests.util_changed_files import filter_changed_markdown, repo_abspath

class TestMarkdownStructure(unittest.TestCase):
    def setUp(self):
        """
        Prepare test state by collecting changed Markdown files and filtering those under the `docs/` directory.
        
        This initialises two instance attributes:
        - `self.changed_md`: list of changed Markdown file paths returned by `filter_changed_markdown()`.
        - `self.docs`: subset of `self.changed_md` containing only paths that start with `docs/` and exist in the repository (resolved via `repo_abspath`).
        
        The method does not return a value.
        """
        self.changed_md = filter_changed_markdown()
        # Only test docs/ markdowns here; PR templates are handled separately
        self.docs = [p for p in self.changed_md if p.startswith("docs/") and os.path.exists(repo_abspath(p))]

    def test_files_exist(self):
        for p in self.docs:
            with self.subTest(p=p):
                self.assertTrue(os.path.exists(repo_abspath(p)), f"Missing file: {p}")

    def test_no_tabs_or_crlf(self):
        """
        Check each changed Markdown file under docs/ does not contain tab characters or CRLF line endings.
        
        Raises assertion failures if a file contains a tab (message: "Tabs found (prefer spaces)") or a CRLF sequence (message: "CRLF found (prefer LF)").
        """
        for p in self.docs:
            with self.subTest(p=p):
                content = open(repo_abspath(p), "rb").read()
                self.assertNotIn(b"\t", content, "Tabs found (prefer spaces)")
                self.assertNotIn(b"\r\n", content, "CRLF found (prefer LF)")

    def test_no_trailing_whitespace(self):
        """
        Check that none of the changed Markdown files contain lines ending with a space.
        
        Iterates over each path in self.docs and fails the test if any non-empty line in a file ends with a trailing space.
        The failure message is "Trailing space at {path}:{line_number}" for the first offending line found.
        """
        for p in self.docs:
            with self.subTest(p=p):
                lines = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read().splitlines()
                for i, line in enumerate(lines, start=1):
                    self.assertFalse(len(line) > 0 and line.endswith(" "), f"Trailing space at {p}:{i}")

    def test_max_line_length_ignoring_code_blocks(self):
        # Allow long lines in fenced code blocks; enforce <= 120 elsewhere
        """
        Fail the test if any line outside fenced code blocks is longer than 120 characters.
        
        Reads each changed Markdown file and checks line lengths, ignoring sections between lines that start with ````` (fenced code blocks). Files are read as UTF-8 with replacement for errors; if a long line is found the test fails indicating the file and line number.
        """
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
        """
        Check that each changed Markdown document begins with a top-level H1 heading.
        
        Asserts that, after trimming leading whitespace, the first line of each file listed in self.docs starts with `#`. Fails with "Expected H1 heading at top of {path}" when a file does not meet this requirement.
        """
        for p in self.docs:
            with self.subTest(p=p):
                text = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read().lstrip()
                lines = text.splitlines()
                first_line = lines[0] if lines else ""
                self.assertTrue(first_line.startswith("#"), f"Expected H1 heading at top of {p}")

    def test_eof_newline(self):
        """
        Assert that every file in self.docs is either empty or ends with a newline.
        
        Iterates over self.docs, reads each file in binary mode and fails the test if a file is non-empty and does not end with a LF byte; the failure message includes the file path.
        """
        for p in self.docs:
            with self.subTest(p=p):
                with open(repo_abspath(p), "rb") as f:
                    data = f.read()
                self.assertTrue(len(data) == 0 or data.endswith(b"\n"), f"File should end with newline: {p}")

if __name__ == "__main__":
    unittest.main()