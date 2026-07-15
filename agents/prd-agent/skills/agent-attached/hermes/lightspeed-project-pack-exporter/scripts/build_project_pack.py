#!/usr/bin/env python3
import json
from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
manifest = {
    'proposed_folder_structure': [str(p.relative_to(root)) for p in sorted(root.rglob('*')) if p != root],
    'validation_status': 'dry-run only'
}
print(json.dumps(manifest, indent=2))
