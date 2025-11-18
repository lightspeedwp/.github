#!/bin/bash
# scripts/includes/utilities/date-utils.sh

# ============================================================================
# Script Name: date-utils.sh
# Description: Date and time manipulation utilities
# Usage: source scripts/includes/utilities/date-utils.sh
# Examples:
#   get_current_date
#   get_current_timestamp
#   format_date "$timestamp" "%Y-%m-%d"
#   date_diff "2025-01-01" "2025-12-31"
# ============================================================================

set -euo pipefail

get_current_date() {
    local format="${1:-%Y-%m-%d}"
    date +"$format"
}

get_current_timestamp() {
    date +%s
}

get_current_datetime() {
    local format="${1:-%Y-%m-%d %H:%M:%S}"
    date +"$format"
}

format_date() {
    local timestamp="$1"
    local format="${2:-%Y-%m-%d %H:%M:%S}"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -r "$timestamp" +"$format"
    else
        # Linux
        date -d "@$timestamp" +"$format"
    fi
}

parse_date() {
    local date_string="$1"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -j -f "%Y-%m-%d" "$date_string" +%s
    else
        # Linux
        date -d "$date_string" +%s
    fi
}

date_diff() {
    local date1="$1"
    local date2="$2"
    local unit="${3:-days}"

    local timestamp1
    local timestamp2
    timestamp1=$(parse_date "$date1")
    timestamp2=$(parse_date "$date2")

    local diff=$((timestamp2 - timestamp1))

    case "$unit" in
        seconds)
            echo "$diff"
            ;;
        minutes)
            echo $((diff / 60))
            ;;
        hours)
            echo $((diff / 3600))
            ;;
        days)
            echo $((diff / 86400))
            ;;
        *)
            echo "$diff"
            ;;
    esac
}

add_days() {
    local date_string="$1"
    local days="$2"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -j -v+"${days}d" -f "%Y-%m-%d" "$date_string" +%Y-%m-%d
    else
        # Linux
        date -d "$date_string + $days days" +%Y-%m-%d
    fi
}

subtract_days() {
    local date_string="$1"
    local days="$2"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -j -v-"${days}d" -f "%Y-%m-%d" "$date_string" +%Y-%m-%d
    else
        # Linux
        date -d "$date_string - $days days" +%Y-%m-%d
    fi
}

is_valid_date() {
    local date_string="$1"
    local format="${2:-%Y-%m-%d}"

    if date -d "$date_string" >/dev/null 2>&1 || date -j -f "$format" "$date_string" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

get_iso_date() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

get_week_number() {
    local date_string="${1:-$(get_current_date)}"
    date -d "$date_string" +%V 2>/dev/null || date -j -f "%Y-%m-%d" "$date_string" +%V
}

get_day_of_week() {
    local date_string="${1:-$(get_current_date)}"
    date -d "$date_string" +%A 2>/dev/null || date -j -f "%Y-%m-%d" "$date_string" +%A
}

get_month_name() {
    local date_string="${1:-$(get_current_date)}"
    date -d "$date_string" +%B 2>/dev/null || date -j -f "%Y-%m-%d" "$date_string" +%B
}

is_weekend() {
    local date_string="${1:-$(get_current_date)}"
    local day_of_week
    day_of_week=$(date -d "$date_string" +%u 2>/dev/null || date -j -f "%Y-%m-%d" "$date_string" +%u)

    [[ $day_of_week -ge 6 ]]
}
