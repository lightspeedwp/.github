#!/usr/bin/env bash
#
# Script Name: performance-check.sh
# Description: Performance monitoring for deployed shell scripts
# Usage: ./performance-check.sh [--environment <env>] [--benchmark]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# Options:
#   --environment <env> - Target environment (staging|production|local)
#   --benchmark        - Run detailed benchmarks
#   --json             - Output results in JSON format
#
# Examples:
#   ./performance-check.sh
#   ./performance-check.sh --environment staging --benchmark
#   ./performance-check.sh --json > performance-report.json
#

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load common functions if available
if [[ -f "$PROJECT_ROOT/scripts/includes/core/logging.sh" ]]; then
    # shellcheck source=../includes/core/logging.sh
    source "$PROJECT_ROOT/scripts/includes/core/logging.sh"
else
    # Fallback logging functions
    log_info() { echo "[INFO] $*"; }
    log_success() { echo "[SUCCESS] $*"; }
    log_error() { echo "[ERROR] $*" >&2; }
    log_warning() { echo "[WARNING] $*"; }
fi

# Configuration
ENVIRONMENT="${ENVIRONMENT:-local}"
RUN_BENCHMARK=false
JSON_OUTPUT=false

# Parse command-line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --benchmark)
                RUN_BENCHMARK=true
                shift
                ;;
            --json)
                JSON_OUTPUT=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

show_usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Monitor performance of deployed shell scripts.

OPTIONS:
    --environment <env>  Target environment (staging|production|local)
    --benchmark          Run detailed benchmarks
    --json               Output results in JSON format
    -h, --help           Show this help message

EXAMPLES:
    $(basename "$0")                                    # Basic performance check
    $(basename "$0") --environment staging --benchmark  # Full benchmark
    $(basename "$0") --json > performance-report.json  # JSON output

EOF
}

# Get target path based on environment
get_target_path() {
    case "$ENVIRONMENT" in
        "staging")
            echo "/opt/lightspeed-wp/staging"
            ;;
        "production")
            echo "/opt/lightspeed-wp/production"
            ;;
        "local"|*)
            echo "$PROJECT_ROOT"
            ;;
    esac
}

# Check system resources
check_system_resources() {
    log_info "Checking system resources..."

    # CPU load average
    local load_avg
    load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')

    echo "CPU Load Average (1min): $load_avg"

    # Memory usage
    local mem_usage
    mem_usage=$(free | awk '/Mem:/ {printf "%.1f", $3/$2 * 100}')

    echo "Memory Usage: ${mem_usage}%"

    # Disk I/O if iostat available
    if command -v iostat &> /dev/null; then
        echo "Disk I/O:"
        iostat -x 1 2 | tail -n +4 | head -n 5
    fi
}

# Benchmark script loading time
benchmark_script_loading() {
    local target_path="$1"

    log_info "Benchmarking script loading times..."

    local total_time=0
    local script_count=0

    while IFS= read -r script; do
        local start_time end_time elapsed

        start_time=$(date +%s%N)
        # shellcheck disable=SC1090
        (source "$script" &> /dev/null) || true
        end_time=$(date +%s%N)

        elapsed=$(( (end_time - start_time) / 1000000 ))
        ((script_count++))
        ((total_time += elapsed))

        if [[ "$RUN_BENCHMARK" == true ]]; then
            printf "%-60s %5d ms\n" "$(basename "$script")" "$elapsed"
        fi
    done < <(find "$target_path/scripts/includes" -name "*.sh" -type f 2>/dev/null | head -10)

    if [[ $script_count -gt 0 ]]; then
        local avg_time=$((total_time / script_count))
        echo ""
        log_info "Average loading time: ${avg_time}ms across $script_count scripts"
    else
        log_warning "No scripts found to benchmark"
    fi
}

# Check script file sizes
check_script_sizes() {
    local target_path="$1"

    log_info "Analyzing script sizes..."

    local total_size=0
    local script_count=0
    local largest_script=""
    local largest_size=0

    while IFS= read -r script; do
        local size
        size=$(stat -f%z "$script" 2>/dev/null || stat -c%s "$script" 2>/dev/null || echo "0")

        ((script_count++))
        ((total_size += size))

        if [[ $size -gt $largest_size ]]; then
            largest_size=$size
            largest_script="$script"
        fi
    done < <(find "$target_path/scripts" -name "*.sh" -type f 2>/dev/null)

    if [[ $script_count -gt 0 ]]; then
        local avg_size=$((total_size / script_count))
        local total_kb=$((total_size / 1024))
        local avg_kb=$((avg_size / 1024))

        echo "Total Scripts: $script_count"
        echo "Total Size: ${total_kb}KB"
        echo "Average Size: ${avg_kb}KB"

        if [[ $largest_size -gt 0 ]]; then
            local largest_kb=$((largest_size / 1024))
            echo "Largest Script: $(basename "$largest_script") (${largest_kb}KB)"
        fi
    else
        log_warning "No scripts found"
    fi
}

# Count script complexity (functions, lines of code)
analyze_script_complexity() {
    local target_path="$1"

    if [[ "$RUN_BENCHMARK" != true ]]; then
        return 0
    fi

    log_info "Analyzing script complexity..."

    local total_lines=0
    local total_functions=0
    local script_count=0

    while IFS= read -r script; do
        local lines functions

        lines=$(wc -l < "$script")
        functions=$(grep -c "^[[:space:]]*function\|^[[:space:]]*[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*().*{" "$script" || echo "0")

        ((script_count++))
        ((total_lines += lines))
        ((total_functions += functions))
    done < <(find "$target_path/scripts" -name "*.sh" -type f 2>/dev/null)

    if [[ $script_count -gt 0 ]]; then
        local avg_lines=$((total_lines / script_count))
        local avg_functions=$((total_functions / script_count))

        echo ""
        echo "Code Metrics:"
        echo "  Total Lines of Code: $total_lines"
        echo "  Total Functions: $total_functions"
        echo "  Average Lines per Script: $avg_lines"
        echo "  Average Functions per Script: $avg_functions"
    fi
}

# Run performance checks
run_performance_checks() {
    local target_path
    target_path=$(get_target_path)

    log_info "Running performance checks for environment: $ENVIRONMENT"
    log_info "Target path: $target_path"
    echo ""

    check_system_resources
    echo ""

    check_script_sizes "$target_path"
    echo ""

    benchmark_script_loading "$target_path"
    echo ""

    analyze_script_complexity "$target_path"
}

# Output results
output_results() {
    if [[ "$JSON_OUTPUT" == true ]]; then
        jq -n \
            --arg environment "$ENVIRONMENT" \
            --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
            --arg status "completed" \
            '{
                environment: $environment,
                timestamp: $timestamp,
                status: $status,
                note: "Performance data collected"
            }'
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "Performance check completed"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
}

# Script entry point
main() {
    parse_arguments "$@"

    run_performance_checks

    output_results

    exit 0
}

# Run main function
main "$@"
