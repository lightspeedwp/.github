#!/usr/bin/env bash
###############################################################################
# Build canonical project-fields.yml from CSV fixtures
#
# Reads CSV fixtures in scripts/projects/fixtures/*-fields.csv and builds
# canonical YAML at .github/automation/project-fields.yml
#
# Dependencies: yq (v4+), jq
# CSV Format: name,type,options,description,color
# Options are pipe-separated (|) in the CSV
#
# @author LightSpeed
# @requires yq, jq
###############################################################################
set -euo pipefail

FIX_DIR="scripts/projects/fixtures"
OUT_YML=".github/automation/project-fields.yml"
TMP_JSON="$(mktemp)"

# Initialize JSON structure
jq -n '{schema:1, types:{}}' > "$TMP_JSON"

# Find all *-fields.csv files
for csv in "$FIX_DIR"/*-fields.csv; do
  [[ ! -f "$csv" ]] && continue

  # Extract type name from filename (e.g., product-development-fields.csv -> product-development)
  type_key="$(basename "$csv" .csv | sed 's/-fields$//')"

  echo "Processing $type_key from $csv..."

  # Read CSV and build JSON structure
  # Skip comment lines (starting with #) and header
  awk -F',' '
    NR==1 || /^#/ { next }  # Skip header and comments
    NF > 0 {  # Only process non-empty lines
      # Extract fields
      name = $1
      type = $2
      options = $3
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", name)    # Trim whitespace
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", type)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", options)
      gsub(/^"|"$/, "", options)  # Remove surrounding quotes

      # Generate slug from name (lowercase, replace spaces with hyphens)
      slug = tolower(name)
      gsub(/[[:space:]]+/, "-", slug)

      # Print as JSON-compatible line
      printf "{\"key\":\"%s\",\"slug\":\"%s\",\"type\":\"%s\"", name, slug, type

      # Add options array if present (pipe-separated)
      if (options != "") {
        printf ",\"options\":["
        split(options, opts, "|")
        for (i in opts) {
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", opts[i])
          if (i > 1) printf ","
          printf "\"%s\"", opts[i]
        }
        printf "]"
      }
      printf "}\n"
    }
  ' "$csv" | while read -r field_json; do
    # Merge into main JSON
    jq --arg t "$type_key" \
       --argjson field "$field_json" \
       '
       .types[$t] //= {project_name:$t, fields:[]}
       | .types[$t].fields += [$field]
       ' "$TMP_JSON" > "$TMP_JSON.new" && mv "$TMP_JSON.new" "$TMP_JSON"
  done
done

# Emit YAML deterministically (sorted keys)
if command -v yq &> /dev/null; then
  yq -P 'sort_keys(..)' "$TMP_JSON" > "$OUT_YML"
else
  echo "⚠️  yq not found, outputting unsorted YAML"
  yq -P "$TMP_JSON" > "$OUT_YML"
fi

echo "✅ Built $OUT_YML from CSV fixtures"
rm -f "$TMP_JSON"
