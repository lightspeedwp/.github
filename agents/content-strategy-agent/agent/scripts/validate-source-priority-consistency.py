#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
BUSINESS_CONTEXT = ROOT / 'business-context.md'
ROUTING_GUIDE = ROOT / 'references' / 'file-usage-and-routing-guide.md'
errors = []

if not BUSINESS_CONTEXT.exists():
    errors.append('business-context.md is missing')
elif not ROUTING_GUIDE.exists():
    errors.append('references/file-usage-and-routing-guide.md is missing')
else:
    bc_text = BUSINESS_CONTEXT.read_text(encoding='utf-8').lower()
    rg_text = ROUTING_GUIDE.read_text(encoding='utf-8').lower()

    expected_priority_terms = [
        'approved project files',
        'attached reference files',
        'approved memory entries',
        'app sources',
        'web research',
    ]
    for term in expected_priority_terms:
        if term not in bc_text:
            errors.append(f'business-context.md: missing source priority term {term}')

    routing_requirements = [
        'skill-routing-guide.md',
        'validation-standards.md',
        'memory/readme.md',
        'connectors.md',
    ]
    for snippet in routing_requirements:
        if snippet not in rg_text:
            errors.append(f'references/file-usage-and-routing-guide.md: missing consistency rule {snippet}')

    if 'approved memory entries' in bc_text and 'memory/readme.md' not in rg_text:
        errors.append('memory saving rule is inconsistent between business context and routing guide')

    if 'app sources' in bc_text and 'connectors.md' not in rg_text:
        errors.append('app and source usage boundaries are inconsistent across files')

if errors:
    print('Source-priority consistency validation failed:')
    for err in errors:
        print(f'- {err}')
    sys.exit(1)

print('Source-priority consistency validation passed.')
