#!/bin/bash
# scripts/includes/interfaces/github-interface.sh

# ============================================================================
# Script Name: github-interface.sh
# Description: Clean interface for GitHub API operations with dependency injection
# Usage: source scripts/includes/interfaces/github-interface.sh
# Examples:
#   # Configure API client
#   configure_github_client "https://api.github.com" "$GITHUB_TOKEN"
#
#   # Repository operations
#   github_get_repository "owner/repo"
#   github_create_repository "new-repo" "Repository description"
#
#   # Issue operations
#   github_create_issue "owner/repo" "Issue Title" "Issue description"
#   github_update_issue "owner/repo" 123 "Updated title"
#
#   # Label operations
#   github_sync_labels "owner/repo" "labels.json"
# ============================================================================

set -euo pipefail

# Interface dependencies (injected)
declare -A GITHUB_CONFIG=()
declare -A GITHUB_CLIENT_DEPENDENCIES=()

# Configure GitHub client with dependency injection
configure_github_client() {
    local api_base_url="$1"
    local auth_token="$2"
    local http_client="${3:-curl}"
    local json_processor="${4:-jq}"

    GITHUB_CONFIG[api_base_url]="$api_base_url"
    GITHUB_CONFIG[auth_token]="$auth_token"
    GITHUB_CONFIG[user_agent]="LightSpeed-WP-Scripts/1.0"

    GITHUB_CLIENT_DEPENDENCIES[http_client]="$http_client"
    GITHUB_CLIENT_DEPENDENCIES[json_processor]="$json_processor"

    # Validate dependencies
    validate_github_dependencies || return 1

    log_info "GitHub client configured for: $api_base_url"
}

validate_github_dependencies() {
    local http_client="${GITHUB_CLIENT_DEPENDENCIES[http_client]}"
    local json_processor="${GITHUB_CLIENT_DEPENDENCIES[json_processor]}"

    if ! command -v "$http_client" >/dev/null 2>&1; then
        log_error "HTTP client not found: $http_client"
        return 1
    fi

    if ! command -v "$json_processor" >/dev/null 2>&1; then
        log_error "JSON processor not found: $json_processor"
        return 1
    fi

    if [[ -z "${GITHUB_CONFIG[auth_token]:-}" ]]; then
        log_error "GitHub authentication token not configured"
        return 1
    fi

    return 0
}

# Repository interface operations
github_get_repository() {
    local repo_path="$1"
    local output_format="${2:-json}"

    local response
    response=$(github_api_request "GET" "repos/$repo_path" "" "$output_format")
    local status=$?

    if [[ $status -eq 0 ]]; then
        echo "$response"
    else
        log_error "Failed to get repository: $repo_path"
        return 1
    fi
}

github_create_repository() {
    local repo_name="$1"
    local description="$2"
    local is_private="${3:-false}"
    local auto_init="${4:-true}"

    local payload
    payload=$(create_repository_payload "$repo_name" "$description" "$is_private" "$auto_init")
    local response
    response=$(github_api_request "POST" "user/repos" "$payload" "json")
    local status=$?

    if [[ $status -eq 0 ]]; then
        log_success "Repository created: $repo_name"
        echo "$response"
    else
        log_error "Failed to create repository: $repo_name"
        return 1
    fi
}

github_list_repositories() {
    local org_name="${1:-}"
    local per_page="${2:-30}"
    local page="${3:-1}"

    local endpoint
    if [[ -n "$org_name" ]]; then
        endpoint="orgs/$org_name/repos"
    else
        endpoint="user/repos"
    fi

    local query_params="per_page=$per_page&page=$page&sort=updated"
    local response
    response=$(github_api_request "GET" "$endpoint?$query_params" "" "json")

    echo "$response"
}

# Issue interface operations
github_create_issue() {
    local repo_path="$1"
    local title="$2"
    local body="$3"
    local labels="${4:-}"
    local assignees="${5:-}"

    local payload
    payload=$(create_issue_payload "$title" "$body" "$labels" "$assignees")
    local response
    response=$(github_api_request "POST" "repos/$repo_path/issues" "$payload" "json")
    local status=$?

    if [[ $status -eq 0 ]]; then
        log_success "Issue created in $repo_path: $title"
        echo "$response"
    else
        log_error "Failed to create issue in $repo_path: $title"
        return 1
    fi
}

github_update_issue() {
    local repo_path="$1"
    local issue_number="$2"
    local title="${3:-}"
    local body="${4:-}"
    local state="${5:-}"
    local labels="${6:-}"

    local payload
    payload=$(create_issue_update_payload "$title" "$body" "$state" "$labels")
    local response
    response=$(github_api_request "PATCH" "repos/$repo_path/issues/$issue_number" "$payload" "json")
    local status=$?

    if [[ $status -eq 0 ]]; then
        log_success "Issue updated in $repo_path: #$issue_number"
        echo "$response"
    else
        log_error "Failed to update issue in $repo_path: #$issue_number"
        return 1
    fi
}

# Label interface operations
github_sync_labels() {
    local repo_path="$1"
    local labels_config_file="$2"
    local dry_run="${3:-false}"

    log_info "Synchronising labels for $repo_path"

    # Get current labels
    local current_labels
    current_labels=$(github_api_request "GET" "repos/$repo_path/labels" "" "json")

    # Get target labels from configuration
    local target_labels
    if ! target_labels=$(cat "$labels_config_file"); then
        log_error "Failed to read labels configuration: $labels_config_file"
        return 1
    fi

    # Process label synchronisation
    sync_repository_labels "$repo_path" "$current_labels" "$target_labels" "$dry_run"
}

# Core API request function
github_api_request() {
    local method="$1"
    local endpoint="$2"
    local payload="$3"
    local response_format="${4:-json}"

    local http_client="${GITHUB_CLIENT_DEPENDENCIES[http_client]}"
    local api_url="${GITHUB_CONFIG[api_base_url]}/$endpoint"
    local auth_header="Authorization: token ${GITHUB_CONFIG[auth_token]}"
    local user_agent_header="User-Agent: ${GITHUB_CONFIG[user_agent]}"

    local temp_response="/tmp/github_response_$$"
    local temp_headers="/tmp/github_headers_$$"

    # Build curl command
    local curl_args=(
        -s
        -w "%{http_code}"
        -H "$auth_header"
        -H "$user_agent_header"
        -H "Accept: application/vnd.github.v3+json"
        -o "$temp_response"
        -D "$temp_headers"
    )

    if [[ -n "$payload" ]]; then
        curl_args+=(-H "Content-Type: application/json" -d "$payload")
    fi

    curl_args+=(-X "$method" "$api_url")

    # Execute request
    local http_status
    if ! http_status=$("$http_client" "${curl_args[@]}" 2>/dev/null); then
        log_error "HTTP request failed for: $method $endpoint"
        cleanup_temp_files "$temp_response" "$temp_headers"
        return 1
    fi

    # Process response
    if [[ "$http_status" =~ ^2[0-9][0-9]$ ]]; then
        case "$response_format" in
            "json")
                cat "$temp_response"
                ;;
            "raw")
                cat "$temp_response"
                ;;
            "headers")
                cat "$temp_headers"
                ;;
        esac
        cleanup_temp_files "$temp_response" "$temp_headers"
        return 0
    else
        log_error "API request failed with status $http_status: $method $endpoint"
        log_error "Response: $(cat "$temp_response")"
        cleanup_temp_files "$temp_response" "$temp_headers"
        return 1
    fi
}

# Payload creation helpers
create_repository_payload() {
    local name="$1"
    local description="$2"
    local is_private="$3"
    local auto_init="$4"

    cat << EOF
{
    "name": "$name",
    "description": "$description",
    "private": $is_private,
    "auto_init": $auto_init,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": false
}
EOF
}

create_issue_payload() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local assignees="$4"

    local json_processor="${GITHUB_CLIENT_DEPENDENCIES[json_processor]}"

    # Build JSON payload dynamically
    echo '{}' | \
    "$json_processor" \
        --arg title "$title" \
        --arg body "$body" \
        --argjson labels "$(echo "$labels" | "$json_processor" -R -s 'split(",") | map(select(length > 0))')" \
        --argjson assignees "$(echo "$assignees" | "$json_processor" -R -s 'split(",") | map(select(length > 0))')" \
        '{
            title: $title,
            body: $body,
            labels: $labels,
            assignees: $assignees
        }'
}

create_issue_update_payload() {
    local title="$1"
    local body="$2"
    local state="$3"
    local labels="$4"

    local json_processor="${GITHUB_CLIENT_DEPENDENCIES[json_processor]}"
    local payload="{}"

    if [[ -n "$title" ]]; then
        payload=$(echo "$payload" | "$json_processor" --arg title "$title" '. + {title: $title}')
    fi

    if [[ -n "$body" ]]; then
        payload=$(echo "$payload" | "$json_processor" --arg body "$body" '. + {body: $body}')
    fi

    if [[ -n "$state" ]]; then
        payload=$(echo "$payload" | "$json_processor" --arg state "$state" '. + {state: $state}')
    fi

    if [[ -n "$labels" ]]; then
        local labels_array
        labels_array=$(echo "$labels" | "$json_processor" -R -s 'split(",") | map(select(length > 0))')
        payload=$(echo "$payload" | "$json_processor" --argjson labels "$labels_array" '. + {labels: $labels}')
    fi

    echo "$payload"
}

sync_repository_labels() {
    local repo_path="$1"
    local current_labels="$2"
    local target_labels="$3"
    local dry_run="$4"

    # This is a placeholder for the actual synchronisation logic
    # Implementation would compare current vs target and create/update/delete as needed
    if [[ "$dry_run" == "true" ]]; then
        log_info "[DRY RUN] Would synchronise labels for $repo_path"
    else
        log_info "Synchronising labels for $repo_path"
    fi

    return 0
}

cleanup_temp_files() {
    local files=("$@")
    for file in "${files[@]}"; do
        [[ -f "$file" ]] && rm -f "$file"
    done
}

# Helper function stubs (require logging.sh to be sourced)
log_info() {
    echo "[INFO] $*" >&2
}

log_success() {
    echo "[SUCCESS] $*" >&2
}

log_error() {
    echo "[ERROR] $*" >&2
}
