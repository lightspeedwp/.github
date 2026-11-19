"""Focused regressions for Studio shell wrappers, using a synthetic CLI."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

SCRIPTS = Path(__file__).resolve().parents[2] / 'skills/wp-db-migrate/scripts'


class StudioMigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.site = self.root / 'site with spaces'
        self.site.mkdir()
        (self.site / 'wp-config.php').touch()
        self.bin = self.root / 'bin'
        self.bin.mkdir()
        self.trace = self.root / 'trace'
        cli = self.bin / 'studio'
        cli.write_text('''#!/bin/bash
printf '%s\\n' "$*" >> "$TRACE"
case "$*" in
  'wp db prefix'*) echo "${PREFIX:-custom_}" ;;
  'wp db query'*)
    if [[ "$*" == *custom_postmeta* ]]; then echo partial; exit 1; fi
    echo 12 ;;
  'wp option get'*) echo https://example.local ;;
  export*) touch "$2"; echo 'CLI progress' ;;
  import*) echo imported ;;
  list*) exit 1 ;;
esac
''')
        cli.chmod(0o755)
        self.env = dict(os.environ, PATH=f'{self.bin}:{os.environ["PATH"]}',
                        TRACE=str(self.trace), TERM='xterm')
        self.backup = self.root / 'backup file.sql'
        self.backup.touch()

    def run_script(self, name, *args, input=''):
        return subprocess.run(['bash', str(SCRIPTS / name), *map(str, args)],
                              input=input, text=True, capture_output=True,
                              cwd=self.root, env=self.env, timeout=5)

    def test_logging_uses_stderr(self):
        result = subprocess.run(['bash', '-c', '''source "$1"
STUDIO_DEBUG=true
log_info info; log_success success; log_warning warning
log_error error; log_debug debug; log_section section
''', 'bash', str(SCRIPTS / 'lib-studio.sh')], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, '')
        for message in ['info', 'success', 'warning', 'error', 'debug', 'section']:
            self.assertIn(message, result.stderr)

    def test_prefix_counts_and_query_failure(self):
        result = self.run_script('studio-db-operations.sh', 'table-counts', self.site)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), [
            f'  custom_{table}: {"ERROR" if table == "postmeta" else "12"}'
            for table in ['posts', 'postmeta', 'users', 'usermeta', 'terms', 'termmeta', 'options']])
        # Invalid identifiers must not reach SQL interpolation.
        self.env['PREFIX'] = 'bad-prefix;'
        result = self.run_script('studio-db-operations.sh', 'table-counts', self.site)
        self.assertNotEqual(result.returncode, 0)

    def test_flags_and_restore_confirmation(self):
        for args in [('--no-confirm', 'restore', self.site, self.backup),
                     ('restore', '--no-confirm', self.site, self.backup, '--verbose')]:
            result = self.run_script('studio-db-operations.sh', *args)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout, 'imported\n')
        self.trace.unlink()
        result = self.run_script('studio-db-operations.sh', 'restore', self.site, self.backup)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn('import ', self.trace.read_text() if self.trace.exists() else '')
        result = self.run_script('studio-db-operations.sh', 'restore', self.site, self.backup, input='yes\n')
        self.assertEqual(result.stdout, 'imported\n')
        result = self.run_script('studio-db-operations.sh', '--dry-run', 'restore', self.site, self.backup)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, '')

    def test_missing_arguments_and_optional_verify(self):
        result = self.run_script('studio-db-operations.sh', 'restore', self.site)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('required', result.stderr)
        self.assertNotIn('unbound', result.stderr)
        result = self.run_script('studio-db-operations.sh', 'post-migrate-verify', self.site)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_backup_returns_one_path(self):
        result = self.run_script('studio-db-operations.sh', 'backup', self.site, self.backup)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, f'{self.backup}\n')
        result = self.run_script('studio-db-operations.sh', 'pre-migrate-check', self.site)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertRegex(result.stderr, r'Backup: pre-migrate-\d{8}-\d{6}\.sql\n')

    def test_no_match_counts_are_single_zeroes(self):
        result = self.run_script('studio-db-operations.sh', 'compare-counts', self.site, self.backup)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(result.stdout.splitlines()), 5)
        self.assertTrue(all(line.endswith('Original: 0') for line in result.stdout.splitlines()))

    def test_menu_failure_and_eof(self):
        for input in ['', '3\n\n0\n', '7\n']:
            result = self.run_script('studio-site-manager.sh', input=input)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn(r'\033', result.stdout)
        self.assertIn('Goodbye', self.run_script('studio-site-manager.sh', input='3\n\n0\n').stderr)

    def test_preflight_standalone_wp_optional(self):
        # Isolate PATH so a host WP-CLI installation cannot affect the result.
        for command in ['bash', 'grep', 'sed']:
            (self.bin / command).symlink_to(shutil.which(command))
        (self.root / '.studio').mkdir()
        self.env.update(PATH=str(self.bin), HOME=str(self.root))
        result = self.run_script('preflight-check.sh')
        self.assertEqual(result.returncode, 0, result.stdout)
        result = self.run_script('preflight-check.sh', '--require-wp')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('WordPress CLI — NOT FOUND', result.stdout)


if __name__ == '__main__':
    unittest.main()
