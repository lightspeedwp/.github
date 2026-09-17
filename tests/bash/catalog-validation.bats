#!/usr/bin/env bats

setup() {
  REPO_ROOT="$(CDPATH="" cd "$BATS_TEST_DIRNAME/../.." && pwd)"
  CATALOG_FILE="$REPO_ROOT/.github/specs/CATALOG.md"
}

# Helper function to extract markdown links from catalog
extract_catalog_links() {
  grep -oE '\]\(\.\/[0-9]{3}-[^)]+\)' "$CATALOG_FILE" | sed 's/\](\.\/\(.*\))/\1/' || true
}

# Helper function to validate a single link target
validate_link_target() {
  local target="$1"
  local target_dir="${target%/spec.md}"
  [ -d "$REPO_ROOT/.github/specs/$target_dir" ]
}

@test "catalog file exists" {
  [ -f "$CATALOG_FILE" ]
}

@test "catalog contains canonical schema marker" {
  grep -q "Catalog Schema (Canonical)" "$CATALOG_FILE"
}

@test "all catalog links point to existing specification directories" {
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

@test "catalog links reference spec.md files" {
  local non_spec_links=0

  while IFS= read -r link; do
    [ -z "$link" ] && continue
    if [[ ! $link =~ spec\.md$ ]]; then
      echo "Non-spec link: $link"
      ((++non_spec_links))
    fi
  done < <(extract_catalog_links)

  [ $non_spec_links -eq 0 ]
}

@test "catalog entries have exactly 6 columns in canonical schema" {
  # Extract the Active Specifications table header
  local header=$(grep -A 1 "## Active Specifications" "$CATALOG_FILE" | tail -1)

  # Count columns by counting pipes (6 pipes = 6 columns)
  local pipe_count=$(echo "$header" | grep -o '|' | wc -l)

  # 6 columns requires 7 pipes (leading | + 5 separators + trailing |)
  [ "$pipe_count" -eq 7 ]
}
