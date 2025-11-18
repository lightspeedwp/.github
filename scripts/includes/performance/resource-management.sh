#!/bin/bash
# scripts/includes/performance/resource-management.sh

# ============================================================================
# Script Name: resource-management.sh
# Description: Performance-optimised resource management for shell scripts
# Usage: source scripts/includes/performance/resource-management.sh
# Examples:
#   # Memory management
#   optimise_memory_usage
#   monitor_memory_consumption
#
#   # Process management
#   manage_concurrent_processes 4
#   wait_for_process_completion
#
#   # File I/O optimisation
#   batch_file_operations "*.txt" "process_text_file"
#   optimise_large_file_processing "/path/to/large/file"
# ============================================================================

set -euo pipefail

readonly MAX_CONCURRENT_PROCESSES="${MAX_CONCURRENT_PROCESSES:-4}"
readonly MEMORY_THRESHOLD_MB="${MEMORY_THRESHOLD_MB:-1024}"
readonly TEMP_CLEANUP_INTERVAL="${TEMP_CLEANUP_INTERVAL:-300}"

declare -a active_processes=()
declare -A process_memory_usage=()

optimise_memory_usage() {
    log_info "Optimising memory usage"

    # Clear unnecessary variables
    unset large_arrays 2>/dev/null || true

    # Force garbage collection for bash arrays
    declare -A temp_cleanup=()
    temp_cleanup["dummy"]="value"
    unset temp_cleanup

    # Set memory limits if ulimit available
    if command -v ulimit >/dev/null 2>&1; then
        ulimit -v $((MEMORY_THRESHOLD_MB * 1024)) 2>/dev/null || true
    fi

    log_success "Memory optimisation completed"
}

monitor_memory_consumption() {
    local process_pid="${1:-$$}"
    local warning_threshold="${2:-$MEMORY_THRESHOLD_MB}"

    if command -v ps >/dev/null 2>&1; then
        local memory_usage_kb
        memory_usage_kb=$(ps -o rss= -p "$process_pid" 2>/dev/null | tr -d ' ' || echo "0")
        local memory_usage_mb=$((memory_usage_kb / 1024))

        process_memory_usage["$process_pid"]="$memory_usage_mb"

        if [[ $memory_usage_mb -gt $warning_threshold ]]; then
            log_warning "High memory usage detected: ${memory_usage_mb}MB (PID: $process_pid)"
            return 1
        fi

        log_debug "Memory usage: ${memory_usage_mb}MB (PID: $process_pid)"
        return 0
    else
        log_warning "Memory monitoring not available (ps command not found)"
        return 0
    fi
}

manage_concurrent_processes() {
    local max_processes="${1:-$MAX_CONCURRENT_PROCESSES}"
    local command_to_run="$2"
    shift 2
    local process_args=("$@")

    log_info "Managing concurrent processes: max=$max_processes"

    # Wait if we're at the limit
    while [[ ${#active_processes[@]} -ge $max_processes ]]; do
        wait_for_process_completion
        sleep 1
    done

    # Start new process
    "$command_to_run" "${process_args[@]}" &
    local new_pid=$!

    active_processes+=("$new_pid")
    log_debug "Started process: PID=$new_pid, Active=${#active_processes[@]}"

    return 0
}

wait_for_process_completion() {
    local updated_processes=()

    for pid in "${active_processes[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            # Process still running
            updated_processes+=("$pid")
        else
            # Process completed
            wait "$pid" 2>/dev/null || true
            log_debug "Process completed: PID=$pid"
            unset process_memory_usage["$pid"]
        fi
    done

    active_processes=("${updated_processes[@]}")
}

wait_for_all_processes() {
    log_info "Waiting for all processes to complete: ${#active_processes[@]} active"

    for pid in "${active_processes[@]}"; do
        wait "$pid" 2>/dev/null || log_warning "Process $pid exited with error"
    done

    active_processes=()
    process_memory_usage=()

    log_success "All processes completed"
}

batch_file_operations() {
    local file_pattern="$1"
    local operation_function="$2"
    local batch_size="${3:-10}"

    log_info "Starting batch file operations: pattern=$file_pattern, batch_size=$batch_size"

    local files_array=()
    local processed_count=0

    # Build file array
    while IFS= read -r -d '' file; do
        files_array+=("$file")
    done < <(find . -name "$file_pattern" -type f -print0)

    local total_files=${#files_array[@]}
    log_info "Found $total_files files matching pattern: $file_pattern"

    # Process files in batches
    for ((i = 0; i < total_files; i += batch_size)); do
        local batch_end=$((i + batch_size))
        [[ $batch_end -gt $total_files ]] && batch_end=$total_files

        log_debug "Processing batch: files $((i + 1)) to $batch_end"

        # Process batch
        for ((j = i; j < batch_end; j++)); do
            local file="${files_array[j]}"
            manage_concurrent_processes "$MAX_CONCURRENT_PROCESSES" "$operation_function" "$file"
        done

        # Wait for batch completion
        wait_for_all_processes

        processed_count=$batch_end
        log_info "Batch completed: $processed_count/$total_files files processed"
    done

    log_success "Batch file operations completed: $processed_count files processed"
}

optimise_large_file_processing() {
    local file_path="$1"
    local chunk_size="${2:-1000}"
    local processing_function="$3"

    log_info "Optimising large file processing: $file_path (chunk_size=$chunk_size)"

    if [[ ! -f "$file_path" ]]; then
        log_error "File not found: $file_path"
        return 1
    fi

    local temp_dir="/tmp/file_chunks_$$"
    mkdir -p "$temp_dir"

    # Split file into chunks
    split -l "$chunk_size" "$file_path" "$temp_dir/chunk_" || {
        log_error "Failed to split file: $file_path"
        rm -rf "$temp_dir"
        return 1
    }

    # Process chunks in parallel
    local chunk_files=("$temp_dir"/chunk_*)
    log_info "Split into ${#chunk_files[@]} chunks"

    if [[ -n "$processing_function" ]]; then
        for chunk_file in "${chunk_files[@]}"; do
            manage_concurrent_processes "$MAX_CONCURRENT_PROCESSES" "$processing_function" "$chunk_file"
        done

        wait_for_all_processes
    fi

    # Cleanup
    rm -rf "$temp_dir"

    log_success "Large file processing completed: $file_path"
}

setup_periodic_cleanup() {
    local cleanup_interval="${1:-$TEMP_CLEANUP_INTERVAL}"

    log_info "Setting up periodic cleanup: interval=${cleanup_interval}s"

    # Background cleanup process
    (
        while true; do
            sleep "$cleanup_interval"

            # Clean up temporary files older than cleanup interval
            find /tmp -name "lightspeed_*" -type f -mmin +$((cleanup_interval / 60)) -delete 2>/dev/null || true
            find /tmp -name "*_$$" -type f -mmin +$((cleanup_interval / 60)) -delete 2>/dev/null || true

            # Monitor and log memory usage
            monitor_memory_consumption $$

            log_debug "Periodic cleanup completed"
        done
    ) &

    local cleanup_pid=$!

    # Set up cleanup trap
    trap "kill $cleanup_pid 2>/dev/null || true" EXIT

    log_success "Periodic cleanup initialised: PID=$cleanup_pid"
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

log_warning() {
    echo "[WARNING] $*" >&2
}

log_debug() {
    [[ "${VERBOSE:-false}" == "true" ]] && echo "[DEBUG] $*" >&2
}
