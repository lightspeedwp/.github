#!/usr/bin/env bash
#
# Script Name: calculate-quality-score.sh
# Description: Calculate comprehensive quality score for modular shell scripts
# Usage: ./calculate-quality-score.sh [--output <file>] [--verbose]
# Version: 1.0.0
# Author: LightSpeedWP Team
#
# The quality score is calculated based on:
#   - Code quality (ShellCheck results) - 25%
#   - Test coverage - 30%
#   - Documentation completeness - 20%
#   - Security adherence - 15%
#   - Performance metrics - 10%
#
# Options:
#   --output <file>  - Output file for quality report (default: quality-report.json)
#   --verbose        - Enable verbose output
#
# Examples:
#   ./calculate-quality-score.sh
#   ./calculate-quality-score.sh --output my-report.json --verbose
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
OUTPUT_FILE="quality-report.json"
VERBOSE=false

# Parse command-line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --output|-o)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            --verbose|-v)
                VERBOSE=true
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

Calculate comprehensive quality score for modular shell scripts.

OPTIONS:
    --output, -o <file>  Output file for quality report (default: quality-report.json)
    --verbose, -v        Enable verbose output
    -h, --help           Show this help message

QUALITY METRICS:
    Code Quality (25%)      - ShellCheck analysis results
    Test Coverage (30%)     - Test coverage percentage
    Documentation (20%)     - Documentation completeness
    Security (15%)          - Security best practices adherence
    Performance (10%)       - Performance metrics

EXAMPLES:
    $(basename "$0")                                    # Generate quality report
    $(basename "$0") --output custom-report.json       # Custom output file
    $(basename "$0") --verbose                         # Verbose output

EOF
}

# Calculate code quality score (based on ShellCheck)
calculate_code_quality_score() {
    [[ "$VERBOSE" == true ]] && log_info "Calculating code quality score..."

    local total_scripts=0
    local scripts_without_errors=0
    local scripts_without_warnings=0

    while IFS= read -r script; do
        ((total_scripts++))

        # Check for errors
        if shellcheck -S error "$script" >/dev/null 2>&1; then
            ((scripts_without_errors++))
        fi

        # Check for warnings
        if shellcheck -S warning "$script" >/dev/null 2>&1; then
            ((scripts_without_warnings++))
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)

    if [[ $total_scripts -eq 0 ]]; then
        echo "100"
        return
    fi

    # Weight: 70% for no errors, 30% for no warnings
    local error_score=$((scripts_without_errors * 70 / total_scripts))
    local warning_score=$((scripts_without_warnings * 30 / total_scripts))
    local code_quality_score=$((error_score + warning_score))

    [[ "$VERBOSE" == true ]] && echo "  Code quality: ${code_quality_score}% (${scripts_without_errors}/${total_scripts} error-free)"

    echo "$code_quality_score"
}

# Calculate test coverage score
calculate_test_coverage_score() {
    [[ "$VERBOSE" == true ]] && log_info "Calculating test coverage score..."

    local total_includes=0
    local includes_with_tests=0

    # Count includes
    while IFS= read -r include_file; do
        ((total_includes++))

        # Check if corresponding test file exists
        local include_name
        include_name=$(basename "$include_file" .sh)

        # Look for test files in various patterns
        if find tests/ -name "test-${include_name}.bats" -o -name "${include_name}.bats" 2>/dev/null | grep -q .; then
            ((includes_with_tests++))
        fi
    done < <(find scripts/includes -name "*.sh" -type f 2>/dev/null)

    if [[ $total_includes -eq 0 ]]; then
        echo "0"
        return
    fi

    local coverage_score=$((includes_with_tests * 100 / total_includes))

    [[ "$VERBOSE" == true ]] && echo "  Test coverage: ${coverage_score}% (${includes_with_tests}/${total_includes} includes tested)"

    echo "$coverage_score"
}

# Calculate documentation score
calculate_documentation_score() {
    [[ "$VERBOSE" == true ]] && log_info "Calculating documentation score..."

    local total_scripts=0
    local documented_scripts=0

    while IFS= read -r script; do
        ((total_scripts++))

        # Check for required documentation elements
        local has_name has_description has_usage
        has_name=false
        has_description=false
        has_usage=false

        if grep -q "^# Script Name:" "$script"; then
            has_name=true
        fi

        if grep -q "^# Description:" "$script"; then
            has_description=true
        fi

        if grep -q "^# Usage:" "$script"; then
            has_usage=true
        fi

        # Script is considered documented if it has all three elements
        if [[ "$has_name" == true ]] && [[ "$has_description" == true ]] && [[ "$has_usage" == true ]]; then
            ((documented_scripts++))
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)

    if [[ $total_scripts -eq 0 ]]; then
        echo "100"
        return
    fi

    local doc_score=$((documented_scripts * 100 / total_scripts))

    [[ "$VERBOSE" == true ]] && echo "  Documentation: ${doc_score}% (${documented_scripts}/${total_scripts} fully documented)"

    echo "$doc_score"
}

# Calculate security score
calculate_security_score() {
    [[ "$VERBOSE" == true ]] && log_info "Calculating security score..."

    local total_scripts=0
    local secure_scripts=0
    local security_issues=0

    # Common security anti-patterns
    local dangerous_patterns=(
        "eval "
        "source.*\$"
        "curl.*|.*sh"
        "wget.*|.*sh"
        "rm -rf /"
    )

    while IFS= read -r script; do
        ((total_scripts++))

        local has_issues=false

        for pattern in "${dangerous_patterns[@]}"; do
            if grep -qE "$pattern" "$script"; then
                has_issues=true
                ((security_issues++))
                [[ "$VERBOSE" == true ]] && log_warning "Security concern in $(basename "$script"): $pattern"
                break
            fi
        done

        if [[ "$has_issues" == false ]]; then
            ((secure_scripts++))
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)

    if [[ $total_scripts -eq 0 ]]; then
        echo "100"
        return
    fi

    local security_score=$((secure_scripts * 100 / total_scripts))

    [[ "$VERBOSE" == true ]] && echo "  Security: ${security_score}% (${secure_scripts}/${total_scripts} without issues)"

    echo "$security_score"
}

# Calculate performance score
calculate_performance_score() {
    [[ "$VERBOSE" == true ]] && log_info "Calculating performance score..."

    local total_scripts=0
    local efficient_scripts=0

    # Check for performance indicators (set -e, proper quoting, etc.)
    while IFS= read -r script; do
        ((total_scripts++))

        local is_efficient=true

        # Check for 'set -e' or 'set -euo pipefail'
        if ! grep -q "set -e" "$script"; then
            is_efficient=false
        fi

        # Check script size (scripts > 1000 lines might be too large)
        local line_count
        line_count=$(wc -l < "$script")
        if [[ $line_count -gt 1000 ]]; then
            is_efficient=false
        fi

        if [[ "$is_efficient" == true ]]; then
            ((efficient_scripts++))
        fi
    done < <(find scripts/ -name "*.sh" -type f 2>/dev/null)

    if [[ $total_scripts -eq 0 ]]; then
        echo "100"
        return
    fi

    local perf_score=$((efficient_scripts * 100 / total_scripts))

    [[ "$VERBOSE" == true ]] && echo "  Performance: ${perf_score}% (${efficient_scripts}/${total_scripts} optimized)"

    echo "$perf_score"
}

# Calculate overall quality score
calculate_overall_quality_score() {
    log_info "Calculating quality score for modular scripts"

    # Initialize quality report
    cat > "$OUTPUT_FILE" <<EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "project": "LightSpeedWP Modular Scripts",
    "metrics": {},
    "scores": {},
    "overall_score": 0,
    "quality_gates": {}
}
EOF

    # Calculate individual scores
    local code_quality_score
    local test_coverage_score
    local documentation_score
    local security_score
    local performance_score

    code_quality_score=$(calculate_code_quality_score)
    test_coverage_score=$(calculate_test_coverage_score)
    documentation_score=$(calculate_documentation_score)
    security_score=$(calculate_security_score)
    performance_score=$(calculate_performance_score)

    # Calculate weighted overall score
    # Weights: Code(25%), Test(30%), Docs(20%), Security(15%), Performance(10%)
    local overall_score
    overall_score=$(echo "scale=0; \
        ($code_quality_score * 0.25) + \
        ($test_coverage_score * 0.30) + \
        ($documentation_score * 0.20) + \
        ($security_score * 0.15) + \
        ($performance_score * 0.10)" | bc)

    # Update quality report with results
    jq --argjson code "$code_quality_score" \
       --argjson test "$test_coverage_score" \
       --argjson docs "$documentation_score" \
       --argjson security "$security_score" \
       --argjson perf "$performance_score" \
       --argjson overall "$overall_score" \
       '.scores = {
           "code_quality": $code,
           "test_coverage": $test,
           "documentation": $docs,
           "security": $security,
           "performance": $perf
       } |
       .overall_score = $overall |
       .quality_gates = {
           "code_quality_pass": ($code >= 80),
           "test_coverage_pass": ($test >= 70),
           "documentation_pass": ($docs >= 75),
           "security_pass": ($security >= 90),
           "performance_pass": ($perf >= 70),
           "overall_pass": ($overall >= 80)
       }' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && \
        mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

    echo "$overall_score"
}

# Display results
display_results() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Quality Score Report"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Read scores from JSON file
    local overall_score code_score test_score doc_score sec_score perf_score

    overall_score=$(jq -r '.overall_score' "$OUTPUT_FILE")
    code_score=$(jq -r '.scores.code_quality' "$OUTPUT_FILE")
    test_score=$(jq -r '.scores.test_coverage' "$OUTPUT_FILE")
    doc_score=$(jq -r '.scores.documentation' "$OUTPUT_FILE")
    sec_score=$(jq -r '.scores.security' "$OUTPUT_FILE")
    perf_score=$(jq -r '.scores.performance' "$OUTPUT_FILE")

    echo "Overall Score: ${overall_score}%"
    echo ""
    echo "Component Scores:"
    echo "  Code Quality (25%):     ${code_score}%"
    echo "  Test Coverage (30%):    ${test_score}%"
    echo "  Documentation (20%):    ${doc_score}%"
    echo "  Security (15%):         ${sec_score}%"
    echo "  Performance (10%):      ${perf_score}%"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check quality gates
    local gates_passed
    gates_passed=$(jq -r '.quality_gates.overall_pass' "$OUTPUT_FILE")

    if [[ "$gates_passed" == "true" ]]; then
        log_success "✅ Quality gates PASSED (score >= 80%)"
    else
        log_warning "⚠️  Quality gates FAILED (score < 80%)"
    fi

    echo ""
    log_info "Full report saved to: $OUTPUT_FILE"
}

# Script entry point
main() {
    parse_arguments "$@"

    local overall_score
    overall_score=$(calculate_overall_quality_score)

    display_results

    # Output overall score to stdout for CI integration
    echo "$overall_score"

    exit 0
}

# Run main function
main "$@"
