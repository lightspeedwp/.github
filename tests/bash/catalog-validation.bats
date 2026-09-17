#!/usr/bin/env bats

setup() {
  REPO_ROOT="$(CDPATH="" cd "$BATS_TEST_DIRNAME/../.." && pwd)"
  CATALOG_FILE="$REPO_ROOT/.github/specs/CATALOG.md"
}

# Extract every relative specification link (./NNN-...) from the catalog.
extract_catalog_links() {
  grep -oE '\]\(\.\/[0-9]{3}-[^)]+\)' "$CATALOG_FILE" | sed 's/\](\.\/\(.*\))/\1/' || true
}

# Extract only the links that appear in table rows. Prose may link elsewhere.
extract_table_links() {
  grep -E '^\|' "$CATALOG_FILE" | grep -oE '\]\(\.\/[0-9]{3}-[^)]+\)' | sed 's/\](\.\/\(.*\))/\1/' || true
}

# A link target is valid when the file or directory it names exists.
validate_link_target() {
  local target="$1"
  [ -e "$REPO_ROOT/.github/specs/$target" ]
}

@test "catalog file exists" {
  [ -f "$CATALOG_FILE" ]
}

@test "catalog contains canonical schema marker" {
  grep -q "Catalog Schema (Canonical)" "$CATALOG_FILE"
}

@test "all catalog links point to existing targets" {
  local broken_links=0

  while IFS= read -r link; do
    [ -z "$link" ] && continue
    if ! validate_link_target "$link"; then
      echo "Broken link: $link"
      ((++broken_links))
    fi
  done < <(extract_catalog_links)

  [ $broken_links -eq 0 ]
}

@test "catalog table rows link to spec.md files" {
  local non_spec_links=0

  while IFS= read -r link; do
    [ -z "$link" ] && continue
    if [[ ! $link =~ spec\.md$ ]]; then
      echo "Non-spec link: $link"
      ((++non_spec_links))
    fi
  done < <(extract_table_links)

  [ $non_spec_links -eq 0 ]
}

@test "catalog entries have exactly 6 columns in canonical schema" {
  # The table header is the first row after the heading; a blank line sits between them.
  local header
  header=$(grep -A 3 "## Active Specifications" "$CATALOG_FILE" | grep -m1 '^| #')

  # Count columns by counting pipes (6 columns = 7 pipes).
  local pipe_count
  pipe_count=$(echo "$header" | grep -o '|' | wc -l)

  [ "$pipe_count" -eq 7 ]
}
