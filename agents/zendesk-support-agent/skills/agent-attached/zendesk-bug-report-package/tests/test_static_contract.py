#!/usr/bin/env python3
from pathlib import Path
import runpy

runpy.run_path(str(Path(__file__).resolve().parents[1] / "scripts" / "validate_bug_package_pack.py"), run_name="__main__")
