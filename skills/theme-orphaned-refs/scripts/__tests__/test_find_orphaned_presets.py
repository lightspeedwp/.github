"""Tests for find_orphaned_presets.py. Run: python3 -m unittest discover -s skills/theme-orphaned-refs/scripts/__tests__"""
import json
import pathlib
import sys
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

import find_orphaned_presets as fop  # noqa: E402

THEME = {
    "settings": {
        "color": {"palette": [{"slug": "base"}, {"slug": "brand-600"}]},
        "typography": {"fontSizes": [{"slug": "200"}, {"slug": "300"}], "fontFamilies": [{"slug": "body"}]},
        "spacing": {"spacingSizes": [{"slug": "5"}, {"slug": "10"}]},
        "shadow": {"presets": [{"slug": "100"}]},
        "border": {"radiusSizes": [{"slug": "0"}, {"slug": "400"}, {"slug": "700"}]},
    }
}


class ThemeFixture:
    def __init__(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name)
        self.write("theme.json", json.dumps(THEME))

    def write(self, relative: str, text: str) -> None:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


class FindOrphansTest(unittest.TestCase):
    def setUp(self) -> None:
        self.theme = ThemeFixture()
        self.addCleanup(self.theme.tmp.cleanup)

    def orphans(self, **kwargs):
        presets = fop.load_theme_presets(self.theme.root / "theme.json")
        return [(p.relative_to(self.theme.root).as_posix(), t, s, g) for p, t, s, g in fop.find_orphans(self.theme.root, presets, **kwargs)]

    def test_reports_orphans_in_the_theme_files(self) -> None:
        self.theme.write("patterns/hero.php", 'style="color:var(--wp--preset--color--brand-500)" {"fontSize":"var:preset|font-size|small"}')
        self.assertEqual(
            self.orphans(),
            [
                ("patterns/hero.php", "font-size", "small", "300"),
                ("patterns/hero.php", "color", "brand-500", "brand-600"),
            ],
        )

    def test_checks_border_radius_presets(self) -> None:
        self.theme.write(
            "styles/blocks/button/rounded.json",
            '{"radius": "var(--wp--preset--border-radius--600)", "r2": "var:preset|border-radius|400"}',
        )
        # Bare numeric slugs suggest the nearest step on the ladder.
        self.assertEqual(self.orphans(), [("styles/blocks/button/rounded.json", "border-radius", "600", "700")])

    def test_skips_dependency_build_and_agent_folders(self) -> None:
        bad = "var(--wp--preset--color--vivid-purple)"
        for folder in ("node_modules/pkg", "vendor/lib", "build", ".agents/skills", ".git", "coverage"):
            self.theme.write(f"{folder}/file.js", bad)
        self.theme.write("templates/index.html", bad)
        self.assertEqual([o[0] for o in self.orphans()], ["templates/index.html"])

    def test_extra_excludes_and_binary_files(self) -> None:
        bad = "var(--wp--preset--color--vivid-purple)"
        self.theme.write("tmp/file.css", bad)
        self.theme.write("assets/logo.svg", bad)
        self.assertEqual([o[0] for o in self.orphans(skip_dirs=fop.SKIP_DIRS | {"tmp"})], [])

    def test_unreadable_files_and_unknown_types_are_ignored(self) -> None:
        (self.theme.root / "blob.bin").write_bytes(b"\xff\xfe\x00var(--wp--preset--color--x)")
        self.theme.write("parts/header.html", "var(--wp--preset--aspect-ratio--wide)")
        self.assertEqual(self.orphans(), [])


class ClosestSlugTest(unittest.TestCase):
    def test_suggestions(self) -> None:
        self.assertEqual(fop.closest_slug("x", "color", []), "x")
        self.assertEqual(fop.closest_slug("base", "color", ["base"]), "base")
        self.assertEqual(fop.closest_slug("medium", "font-size", ["300", "400"]), "400")
        self.assertEqual(fop.closest_slug("brand-6", "color", ["brand-600", "brand-100"]), "brand-600")
        self.assertEqual(fop.closest_slug("cta-450", "color", ["cta-400", "cta-900"]), "cta-400")
        self.assertEqual(fop.closest_slug("contrast", "color", ["contrast-alt", "base"]), "contrast-alt")
        self.assertEqual(fop.closest_slug("50", "spacing", ["40", "60", "base"]), "40")
        self.assertEqual(fop.closest_slug("600", "border-radius", ["none"]), "none")


class MainTest(unittest.TestCase):
    def test_writes_report_with_excludes(self) -> None:
        theme = ThemeFixture()
        self.addCleanup(theme.tmp.cleanup)
        theme.write("patterns/a.php", "var(--wp--preset--shadow--600)")
        theme.write("scratch/b.php", "var(--wp--preset--shadow--600)")
        argv = ["prog", "--root", str(theme.root), "--report", "report.txt", "--exclude", "scratch"]
        with mock.patch.object(sys, "argv", argv), mock.patch("builtins.print") as printed:
            self.assertEqual(fop.main(), 0)
        report = (theme.root / "report.txt").read_text(encoding="utf-8").strip().splitlines()
        self.assertEqual(len(report), 1)
        self.assertIn("patterns/a.php\tshadow\t600\t100", report[0])
        printed.assert_any_call("Orphaned count: 1")


if __name__ == "__main__":
    unittest.main()
