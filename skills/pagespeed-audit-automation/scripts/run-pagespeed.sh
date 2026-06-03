#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  run-pagespeed.sh [--output-base <path>] <url1> [url2 ...]

Description:
  Runs PageSpeed Insights for each URL with both mobile and desktop strategies.
  Saves JSON results in a single date folder using filenames:
    "url"--mobile.json
    "url"--desktop.json

Environment:
  VSCODE_SETTINGS_PATH  Optional path to VS Code settings.json.
EOF
}

if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

output_base=""
urls=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --output-base)
      shift
      if [[ $# -eq 0 ]]; then
        echo "Error: --output-base requires a path" >&2
        exit 1
      fi
      output_base="$1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      urls+=("$1")
      ;;
  esac
  shift
done

if [[ ${#urls[@]} -eq 0 ]]; then
  echo "Error: at least one URL is required" >&2
  usage
  exit 1
fi

settings_path="${VSCODE_SETTINGS_PATH:-$HOME/Library/Application Support/Code/User/settings.json}"
if [[ ! -f "$settings_path" ]]; then
  echo "Error: VS Code settings file not found at: $settings_path" >&2
  exit 1
fi

api_key=$(ruby -rjson -e 'j=JSON.parse(File.read(ARGV[0])); print(j["pagespeedInsights.apiKey"] || "")' "$settings_path")
if [[ -z "$api_key" ]]; then
  echo "Error: pagespeedInsights.apiKey is missing from VS Code settings." >&2
  exit 1
fi

if [[ -z "$output_base" ]]; then
  output_base="$PWD/reports/pagespeed"
fi

date_folder=$(date +%Y-%m-%d_%H%M%S)
out_dir="$output_base/$date_folder"
mkdir -p "$out_dir"

normalize_url() {
  local input="$1"
  local cleaned
  cleaned=$(printf '%s' "$input" | sed -E 's#^https?://##; s#/$##; s#[^a-zA-Z0-9._-]#-#g; s#-+#-#g')
  if [[ -z "$cleaned" ]]; then
    cleaned="url"
  fi
  printf '%s' "$cleaned"
}

manifest_tmp=$(mktemp)

for url in "${urls[@]}"; do
  normalized=$(normalize_url "$url")
  mobile_file="$out_dir/\"${normalized}\"--mobile.json"
  desktop_file="$out_dir/\"${normalized}\"--desktop.json"

  echo "RUNNING_URL=$url"

  curl --fail --max-time 90 -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${api_key}&strategy=mobile" -o "$mobile_file"
  curl --fail --max-time 90 -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${api_key}&strategy=desktop" -o "$desktop_file"

  echo "COMPLETED_URL=$url"

  printf '%s\t%s\t%s\n' "$url" "$mobile_file" "$desktop_file" >> "$manifest_tmp"
done

manifest_file="$out_dir/manifest.json"
ruby -rjson -e '
rows = File.readlines(ARGV[0], chomp: true).map { |l| l.split("\t", 3) }
manifest = {
  generated_at: Time.now.utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
  output_directory: ARGV[2],
  tested_urls: rows.map do |url, mobile, desktop|
    {
      url: url,
      mobile_json: mobile,
      desktop_json: desktop,
    }
  end,
}
File.write(ARGV[1], JSON.pretty_generate(manifest) + "\n")
' "$manifest_tmp" "$manifest_file" "$out_dir"

rm -f "$manifest_tmp"

echo "OUTPUT_DIRECTORY=$out_dir"
echo "MANIFEST=$manifest_file"
for url in "${urls[@]}"; do
  normalized=$(normalize_url "$url")
  echo "MOBILE_$normalized=$out_dir/\"${normalized}\"--mobile.json"
  echo "DESKTOP_$normalized=$out_dir/\"${normalized}\"--desktop.json"
done
