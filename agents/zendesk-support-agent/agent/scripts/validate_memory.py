from pathlib import Path

allowed = {
    'user-preferences.md',
    'report-defaults.yaml',
    'drafting-preferences.md',
    'todos.md',
}
mem = Path('memory')
extra = [p.name for p in mem.glob('*') if p.is_file() and p.name not in allowed]
if extra:
    raise SystemExit('Unexpected memory files: ' + ', '.join(sorted(extra)))
print('Memory file set is valid.')
