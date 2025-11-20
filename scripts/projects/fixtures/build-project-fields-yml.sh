#!/usr/bin/env bash
# build-project-fields-yml.sh — Generate .github/automation/project-fields.yml from CSV fixtures

set -euo pipefail

FIXTURES_DIR="scripts/projects/fixtures"
OUTPUT_YML=".github/automation/project-fields.yml"

# Ensure yq is installed
if ! command -v yq &> /dev/null; then
  echo "Error: 'yq' is required but not installed." >&2
  exit 1
fi

echo "Building project fields YAML from CSV fixtures..."

# Start the YAML file with schema version and empty types
echo "schema: 1" > "$OUTPUT_YML"
echo "types: {}" >> "$OUTPUT_YML"

# Iterate over each CSV fixture
shopt -s nullglob
for csv in "$FIXTURES_DIR"/*.csv; do
  [ -e "$csv" ] || { echo "No CSV files found in $FIXTURES_DIR, skipping."; break; }
  filename="$(basename "$csv")"
  type_key="${filename%.*}"  # e.g., product_dev or client_services
  # Derive human-readable project name (e.g., "Product Development")
  project_name=$(echo "$type_key" | awk -F"_" '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) } OFS=" "; print}')

  echo "Processing $filename -> type '$type_key' (Project Name: $project_name)"

  # Use yq to create the structure for this type
  yq -i ".types[\"$type_key\"] = {}" "$OUTPUT_YML"
  yq -i ".types[\"$type_key\"].project_name = \"$project_name\"" "$OUTPUT_YML"
  yq -i ".types[\"$type_key\"].fields = []" "$OUTPUT_YML"

  # Read CSV, skipping header
  header_read=false
  while IFS=, read -r field_key field_type field_desc opt1 opt2 opt3 opt4 opt5 opt6 opt7 opt8; do
    if [ "$header_read" = false ]; then
      header_read=true
      continue  # skip header line
    fi
    # Trim whitespace
    field_key="$(echo -n "$field_key" | xargs)"
    [ -z "$field_key" ] && continue  # skip empty lines
    field_type="$(echo -n "$field_type" | xargs)"
    field_desc="$(echo -n "$field_desc" | xargs)"
    # Collect all option columns into an array, ignoring empties
    options=()
    for opt in "$opt1" "$opt2" "$opt3" "$opt4" "$opt5" "$opt6" "$opt7" "$opt8"; do
      opt="$(echo -n "$opt" | xargs)"
      if [ -n "$opt" ]; then
        options+=("$opt")
      fi
    done
    # Generate slug: lowercase, replace non-alphanumeric with underscores, trim underscores
    slug=$(echo "$field_key" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g; s/^_+|_+$//g')

    # Build the field entry as a YAML fragment
    # We will append via yq. Construct a temporary JSON for the field:
    field_json="{\"key\": \"$field_key\", \"slug\": \"$slug\", \"type\": \"$field_type\""
    if [ -n "$field_desc" ]; then
      # Escape quotes in description if any
      desc_escaped=$(echo "$field_desc" | sed 's/"/\\"/g')
      field_json+=", \"description\": \"$desc_escaped\""
    fi
    if [ "${#options[@]}" -gt 0 ]; then
      # Build JSON array string for options
      opts_json=$(printf '%s\n' "${options[@]}" | jq -R . | jq -s .)
      field_json+=", \"options\": $opts_json"
    fi
    field_json+="}"

    # Append this field object to the YAML under the current type
    yq -i ".types[\"$type_key\"].fields += [$field_json]" "$OUTPUT_YML"
  done < "$csv"
done

echo "✅ Successfully built $OUTPUT_YML"
