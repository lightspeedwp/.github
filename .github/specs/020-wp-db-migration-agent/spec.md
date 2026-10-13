# Feature Specification: WordPress DB Migration Agent

**Feature Branch**: `aiops/wp-db-migration-agent`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "WordPress DB Migration Agent (db-migration-agent): a portable LightSpeed agent that helps team members move WordPress databases between MySQL hosts (live/staging) and WordPress Studio local sites (SQLite via the SQLite Database Integration plugin). Three jobs: (1) Live/staging -> Studio: take a mysqldump/phpMyAdmin MySQL export and produce a cleaned copy that the Studio importer accepts, never modifying the original, verifying byte-exact output, and listing every edit. The first skill is this sanitiser, derived from a proven prompt that fixed a real failing import. (2) Studio -> staging/live: check an SQL file exported via phpMyAdmin from a Studio site before it is imported into a MySQL staging or live site. (3) URL replacement: read the current siteurl from the *_options table in the SQL file, prompt the user for the target URL(s), and perform serialisation-safe replacement. Safety: read-only by default, never import into or modify a live/staging database without explicit user confirmation, never print credentials or user personal data, always keep the original file."

## Background

On 2026-10-13 a team member's MySQL export of a staging site failed twice in the WordPress Studio
importer: first on a replication statement (`SET @@GLOBAL.GTID_PURGED`), then on raw binary
literals in a WP All Import table (`wp_pmxi_hash`). Both were fixed by hand with a short,
repeatable set of edits. This agent packages that fix, and the reverse direction, so the rest of
the team can run it without rediscovering it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prepare a live/staging export for a Studio local site (Priority: P1)

A developer has a database export from a live or staging WordPress site (from `mysqldump`, a host
backup tool, or phpMyAdmin on a MySQL server). They ask the agent to make it importable into their
WordPress Studio local site. The agent produces a cleaned copy beside the original, explains every
change, and tells them how to import it and what to check afterwards.

**Why this priority**: This is the failure that triggered the feature. It blocks local development
on every client site whose host runs MySQL with replication or stores binary columns.

**Independent Test**: Give the agent the 2026-10-13 export (or a fixture with the same statements).
It produces a copy that Studio imports without error, with the original file unchanged.

**Acceptance Scenarios**:

1. **Given** an export containing `SET @@GLOBAL.GTID_PURGED` and `SQL_LOG_BIN` statements, **When**
   the user asks the agent to prepare it for Studio, **Then** a new `<name>-sqlite.sql` file is
   written without those statements and the original file is byte-identical to before.
2. **Given** an export containing `_binary '...'` literals, **When** the agent cleans it, **Then**
   each literal is rewritten as an equivalent hex literal, each decodes to the length its column
   declares, and primary-key values stay unique.
3. **Given** a cleaned file, **When** the agent finishes, **Then** it reports a table of every edit
   (what, where, why), the table and insert counts for both files, and the post-import checks
   (site URL scheme, replaced user accounts).
4. **Given** an export containing statements outside the known fixes (for example triggers,
   `DEFINER=` clauses or `CREATE DATABASE`), **When** the agent scans it, **Then** it reports them
   and asks before changing them.
5. **Given** a cleaned file still fails to import, **When** the user pastes the Studio error log,
   **Then** the agent identifies the statement named in the error and proposes a targeted fix.

---

### User Story 2 - Check a Studio export before it goes to staging or live (Priority: P2)

A developer has built or changed content on a Studio local site and exported the database through
the phpMyAdmin tool that Studio provides. Before anyone imports it into a MySQL staging or live
site, they ask the agent to check it. The agent reports anything that would fail on import or
damage the target site, ranked by severity, without changing the file unless asked.

**Why this priority**: An import into staging or live is outward-facing and hard to reverse. A
pre-flight check is cheap and prevents downtime, but it is used less often than Story 1.

**Independent Test**: Give the agent a Studio phpMyAdmin export. It produces a pass/warn/fail
report covering every check below without writing to any database.

**Acceptance Scenarios**:

1. **Given** an export containing tables created internally by the SQLite integration, **When** the
   agent checks it, **Then** it flags them as must-remove before import into MySQL.
2. **Given** an export whose collations or character sets are not supported by the target MySQL
   version the user names, **When** the agent checks it, **Then** it flags the affected tables and
   suggests the compatible equivalent.
3. **Given** an export with `CREATE DATABASE` or `USE` statements, or a table prefix different from
   the one the user says the target uses, **When** the agent checks it, **Then** it flags each one
   with the reason it matters.
4. **Given** an export still containing local Studio URLs, **When** the agent checks it, **Then** it
   flags them and offers the URL replacement step (Story 3).
5. **Given** the check passes, **When** the agent reports, **Then** it states that the import into
   staging or live is the user's action and gives a backup-first checklist; it does not run the
   import itself.

---

### User Story 3 - Replace the site URL safely (Priority: P2)

Whichever direction the database is moving, the site URL stored in it must match the destination.
The agent reads the current URL from the `siteurl` option in the export's options table, whatever
its table prefix, shows it to the user, asks for the destination URL, and performs a
serialisation-safe replacement, previewing the changes before applying them.

**Why this priority**: Without it, a migrated site redirects to the wrong host or loses media and
links. A naive text replacement corrupts serialised WordPress data, so it needs a guarded,
repeatable path.

**Independent Test**: Give the agent an export whose `siteurl` is `http://beta.local`. It reports
that value, asks for the destination, previews the number of replacements, and on confirmation
produces a result in which serialised values still unserialise.

**Acceptance Scenarios**:

1. **Given** an export with options table `wp_options`, `wp123_options` or any other prefix,
   **When** the agent reads it, **Then** it reports the `siteurl` and `home` values and the prefix.
2. **Given** the agent has found the current URL, **When** it asks the user, **Then** it offers the
   likely destination for the direction of travel (for example the `https://` Studio domain) and
   accepts any other URL the user gives, including extra pairs such as a CDN or media domain.
3. **Given** the user has confirmed the URL pairs, **When** the agent replaces them, **Then** it
   runs a preview first, shows the replacement counts per table, and applies only after the user
   confirms.
4. **Given** the destination is a staging or live site, **When** the agent replaces URLs, **Then**
   it writes a new SQL file for the user to import and never connects to or alters the remote
   database.
5. **Given** a replacement method that is not serialisation-aware is the only one available,
   **When** the agent would use it, **Then** it refuses and explains why.

---

### Edge Cases

- **Non-UTF-8 bytes in the dump**: the agent processes the file as bytes. A tool that stops on
  invalid characters (for example macOS `sed` "illegal byte sequence") must not leave a silently
  truncated output; line, table and insert counts are compared every time.
- **Very large dumps (over 1 GB)**: the agent processes them in a streaming way, does not print
  data rows to the conversation, and tells the user the expected run time before starting.
- **Compressed input (`.sql.gz`, `.zip`)**: the agent decompresses to a new file first and never
  overwrites the archive.
- **Multisite exports**: the agent detects multiple `*_options` tables and `wp_blogs`/`wp_site`,
  reports each site's URL, and asks the user for a URL pair per site.
- **No `siteurl` found**: the agent reports that the file may be partial or not a WordPress
  database and asks the user to confirm the source URL rather than guessing.
- **`siteurl` and `home` differ**: the agent reports both and asks for a destination for each.
- **Binary literal that decodes to the wrong length**: the agent stops, reports the row, and writes
  no output, because a wrong decode would corrupt data silently.
- **Credentials or personal data in the dump** (user emails, password hashes, API keys in options):
  the agent never prints them; reports refer to tables and row counts only.
- **The user asks the agent to import into staging or live directly**: the agent declines, explains
  the risk, and provides the commands and a backup-first checklist for the user to run.

## Requirements *(mandatory)*

### Functional Requirements

**General and safety**

- **FR-001**: The agent MUST never modify the input file; every output MUST be a new file beside the
  input, named after it (`<name>-sqlite.sql`, `<name>-checked.sql`, `<name>-urls.sql` or similar).
- **FR-002**: The agent MUST treat dumps as bytes, and MUST verify after every transformation that
  only the intended statements changed (diff of original and output) and that table and insert
  statement counts match.
- **FR-003**: The agent MUST end every transformation with a table listing each edit: what changed,
  where (line or table), and why.
- **FR-004**: The agent MUST NOT import into, connect to, or alter a staging or live database. It
  MAY import into or run commands against the user's local Studio site only after the user
  confirms that specific action.
- **FR-005**: The agent MUST NOT print credentials, password hashes, email addresses, API keys or
  other personal data from a dump; findings MUST reference tables, columns and counts.
- **FR-006**: The agent MUST ask before applying any change outside the known fixes it documents.

**Story 1 - MySQL to Studio (skill 1, the sanitiser)**

- **FR-010**: The sanitiser MUST remove `SET @@GLOBAL.GTID_PURGED` statements and the matching
  `GTID state` comment.
- **FR-011**: The sanitiser MUST remove the three `SQL_LOG_BIN` save, disable and restore statements.
- **FR-012**: The sanitiser MUST rewrite every `_binary '...'` literal as a hex literal holding the
  same bytes, decoding MySQL escape sequences first, and MUST stop with no output if any decoded
  value's length disagrees with its declared fixed-length column.
- **FR-013**: The sanitiser MUST scan for, and report without changing, other statements the Studio
  importer is likely to reject: other `@@GLOBAL` settings, `CREATE DATABASE`/`USE`, `DELIMITER`,
  `DEFINER=`, triggers, stored routines, views, events, full-text and spatial indexes, generated
  columns.
- **FR-014**: The sanitiser MUST leave untouched the statements the importer already handles
  (versioned `/*!40101 ... */` header and footer settings, `LOCK TABLES`, `DISABLE KEYS`, storage
  engine, character set and collation clauses, `ON UPDATE CURRENT_TIMESTAMP`).
- **FR-015**: The sanitiser MUST report the `siteurl`/`home` values and whether a users table is
  present, so the user knows the post-import checks.
- **FR-016**: When an import still fails, the agent MUST accept the Studio error log, locate the
  named statement, and propose a targeted fix to add to the known fixes.

**Story 2 - Studio to staging/live (skill 2, the pre-flight check)**

- **FR-020**: The check MUST flag internal tables created by the SQLite integration as must-remove.
- **FR-021**: The check MUST flag collations and character sets the user's target MySQL or MariaDB
  version does not support, with the compatible equivalent.
- **FR-022**: The check MUST flag `CREATE DATABASE`/`USE` statements, `DROP TABLE` statements that
  would remove tables on the target, and a table prefix that differs from the target's.
- **FR-023**: The check MUST flag local Studio URLs (`*.local`, `localhost`, `127.0.0.1` with a
  port) and hand off to the URL replacement skill.
- **FR-024**: The check MUST produce a report with a pass, warn or fail status per check, and a
  backup-first import checklist for the user.

**Story 3 - URL replacement (skill 3)**

- **FR-030**: The skill MUST find every options table by its `_options` suffix, whatever the prefix,
  and report `siteurl` and `home` for each.
- **FR-031**: The skill MUST prompt the user for the destination URL for each source URL, suggest
  the likely destination for the direction of travel, and allow additional URL pairs.
- **FR-032**: The skill MUST use only a serialisation-aware replacement method, MUST run a preview
  showing per-table replacement counts first, and MUST apply only after the user confirms.
- **FR-033**: For a staging or live destination, the skill MUST produce a new SQL file and leave
  every database other than the user's local Studio site untouched.

**Packaging and governance**

- **FR-040**: The agent MUST follow the repository's agent structure (canonical `*.agent.md`
  specification, `AGENT.md`, `README.md`, `CHANGELOG.md`, `skills/`, `tests/`) and pass
  `npm run validate:agents` and `npm run validate:skills`.
- **FR-041**: Each skill MUST be a self-contained `SKILL.md` that conforms to the Agent Skills
  specification and works when pasted into any AI assistant with shell access, not only Claude
  Code.
- **FR-042**: Deterministic transformations (statement removal, binary literal rewriting, options
  table lookup) MUST be implemented as a script with automated tests, so results do not depend on
  an AI re-deriving the logic.
- **FR-043**: The agent MUST be discoverable as a Claude Code subagent through the generated thin
  definition in `.claude/agents/`.

### Key Entities

- **SQL export**: the input dump. Attributes: source engine (MySQL/MariaDB or Studio SQLite via
  phpMyAdmin), size, compression, table prefix, list of tables.
- **Cleaned output**: a new file derived from the export. Attributes: path, list of edits, counts
  before and after.
- **Finding**: an issue detected in an export. Attributes: check id, severity (fail, warn, info),
  location (line or table), reason, suggested fix, whether the agent may fix it automatically.
- **URL pair**: a source URL found in the options table and the destination the user chose.
  Attributes: options table, option name, preview count, applied flag.
- **Migration direction**: `to-studio` (Story 1) or `to-remote` (Story 2), which decides which
  checks and defaults apply.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The 2026-10-13 export, processed by the agent, imports into a Studio site at the first
  attempt with no manual edits.
- **SC-002**: A team member with no prior knowledge of the fixes can go from a failing export to a
  successful Studio import in under 10 minutes for a dump under 100 MB.
- **SC-003**: In 100% of runs the original file is byte-identical afterwards, and every output
  change appears in the edit table.
- **SC-004**: Every check in Story 2 has a fixture that makes it fail and one that makes it pass, and
  the pre-flight report catches 100% of those fixtures.
- **SC-005**: After URL replacement, 100% of serialised values in the affected tables still
  unserialise, and no occurrence of the source URL remains outside values the user chose to keep.
- **SC-006**: Zero instances of credentials or personal data appear in agent output across the test
  fixtures.

## Assumptions

- Team members use WordPress Studio on macOS, which bundles WP-CLI and the SQLite Database
  Integration plugin; Windows support follows Studio's own support and is not tested in v1.
- Studio's importer accepts the versioned `/*!40101 ... */` comments, `LOCK TABLES` and charset
  clauses, as the 2026-10-13 import proved; only the known fixes are needed for that class of dump.
- Serialisation-safe replacement is done with WP-CLI `search-replace` (bundled with Studio): in
  place on the local Studio site, or with its export option to write a new file for a remote target
  without changing the local database.
- The agent may run commands against the user's local Studio site after confirmation, because that
  site is disposable and restorable; staging and live are always the user's action.
- Skills live inside the agent folder (`agents/wp-db-migration-agent/skills/`) because no other
  agent uses them yet; they move to root `skills/` if a second consumer appears (spec 014 rule on
  shared skills).
- Supported assistants follow the existing skill metadata pattern (Claude first-class; Copilot,
  Codex and Gemini through the same `SKILL.md`).
- Database credentials for remote hosts are out of scope: the user supplies export files; the agent
  never asks for or stores host passwords.
