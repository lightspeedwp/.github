#!/bin/bash
# scripts/includes/utilities/string-utils.sh

# ============================================================================
# Script Name: string-utils.sh
# Description: String manipulation and formatting utilities
# Usage: source scripts/includes/utilities/string-utils.sh
# Examples:
#   trim_whitespace "  hello world  "
#   to_uppercase "hello"
#   to_lowercase "WORLD"
#   string_contains "hello world" "world"
#   string_replace "hello world" "world" "bash"
# ============================================================================

set -euo pipefail

trim_whitespace() {
    local string="$1"
    # Remove leading and trailing whitespace
    string="${string#"${string%%[![:space:]]*}"}"
    string="${string%"${string##*[![:space:]]}"}"
    echo "$string"
}

to_uppercase() {
    local string="$1"
    echo "${string^^}"
}

to_lowercase() {
    local string="$1"
    echo "${string,,}"
}

string_contains() {
    local haystack="$1"
    local needle="$2"
    [[ "$haystack" == *"$needle"* ]]
}

string_replace() {
    local string="$1"
    local search="$2"
    local replace="$3"
    echo "${string//$search/$replace}"
}

string_starts_with() {
    local string="$1"
    local prefix="$2"
    [[ "$string" == "$prefix"* ]]
}

string_ends_with() {
    local string="$1"
    local suffix="$2"
    [[ "$string" == *"$suffix" ]]
}

string_length() {
    local string="$1"
    echo "${#string}"
}

string_split() {
    local string="$1"
    local delimiter="$2"
    local -a result=()

    IFS="$delimiter" read -ra result <<< "$string"
    printf '%s\n' "${result[@]}"
}

string_join() {
    local delimiter="$1"
    shift
    local first="$1"
    shift
    printf "%s" "$first" "${@/#/$delimiter}"
}

string_repeat() {
    local string="$1"
    local count="$2"
    local result=""

    for ((i=0; i<count; i++)); do
        result+="$string"
    done

    echo "$result"
}

string_truncate() {
    local string="$1"
    local max_length="$2"
    local suffix="${3:-...}"

    if [[ ${#string} -gt $max_length ]]; then
        local truncate_at=$((max_length - ${#suffix}))
        echo "${string:0:$truncate_at}$suffix"
    else
        echo "$string"
    fi
}

string_pad_left() {
    local string="$1"
    local width="$2"
    local pad_char="${3:- }"

    printf "%${width}s" "$string" | tr ' ' "$pad_char"
}

string_pad_right() {
    local string="$1"
    local width="$2"
    local pad_char="${3:- }"

    printf "%-${width}s" "$string" | tr ' ' "$pad_char"
}

slugify() {
    local string="$1"

    # Convert to lowercase
    string="${string,,}"

    # Replace spaces and underscores with hyphens
    string="${string//[ _]/-}"

    # Remove special characters
    string=$(echo "$string" | sed 's/[^a-z0-9-]//g')

    # Remove consecutive hyphens
    string=$(echo "$string" | sed 's/--*/-/g')

    # Trim hyphens from start and end
    string="${string#-}"
    string="${string%-}"

    echo "$string"
}

camel_to_snake() {
    local string="$1"
    echo "$string" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//'
}

snake_to_camel() {
    local string="$1"
    echo "$string" | sed -r 's/_([a-z])/\U\1/g'
}
