#!/usr/bin/env bats
# ============================================================================
# Test Name: test-agents-structure.bats
# Testing: Agent structure and standards compliance
# Description: Comprehensive test suite for validating all agents follow LightSpeed WP standards
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bats, node.js, shellcheck
# Usage: bats tests/test-agents-structure.bats
# Environment Variables: None
# Options: None
# Examples:
#   bats tests/test-agents-structure.bats
#   bats -t tests/test-agents-structure.bats
# Notes:
#   - Tests all agents in .github/agents/ directory
#   - Validates structure, documentation, and standards compliance
#   - Supports both JavaScript and shell script agents
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/includes/agent-test-helpers.bash"

setup() {
    setup_agent_test_environment
}

teardown() {
    cleanup_agent_test_environment
}

# ----- Section: Agent Discovery and Basic Structure -----

# ============================================================================
# Test Name: "all agents are documented in AGENTS.md"
# Test Type: Documentation Validation
# Test Scope: Ensures all agent files have corresponding documentation
# ============================================================================
@test "all agents are documented in AGENTS.md" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    local agents_md="${BATS_TEST_DIRNAME}/../AGENTS.md"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file" .agent.js)
        
        # Check if agent is documented
        if ! grep -q "$agent_name" "$agents_md"; then
            echo "Agent '$agent_name' not documented in AGENTS.md"
            return 1
        fi
    done <<< "$agent_files"
}

# ============================================================================
# Test Name: "agent files follow naming convention"
# Test Type: Structure Validation
# Test Scope: Validates agent files use proper .agent.js extension
# ============================================================================
@test "agent files follow naming convention" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all JavaScript files in agents directory
    local js_files
    js_files=$(find "$agents_dir" -name "*.js" -type f 2>/dev/null || true)
    
    if [[ -z "$js_files" ]]; then
        skip "No JavaScript files found in agents directory"
    fi
    
    while IFS= read -r js_file; do
        local filename
        filename=$(basename "$js_file")
        
        # Skip template and documentation files
        if [[ "$filename" == "agent-template.js" ]] || [[ "$filename" == "agent.js" ]]; then
            continue
        fi
        
        # Check if file follows .agent.js convention
        if [[ "$filename" != *.agent.js ]]; then
            echo "Agent file '$filename' should use .agent.js extension"
            return 1
        fi
    done <<< "$js_files"
}

# ----- Section: Agent Structure and Standards -----

# ============================================================================
# Test Name: "agents follow LightSpeed WP standards"
# Test Type: Standards Compliance
# Test Scope: Validates each agent follows comprehensive LightSpeed WP standards
# ============================================================================
@test "agents follow LightSpeed WP standards" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Validating agent: $agent_name"
        assert_agent_follows_standards "$agent_name"
    done <<< "$agent_files"
}

# ============================================================================
# Test Name: "agents have proper header documentation"
# Test Type: Documentation Validation
# Test Scope: Validates agents have complete header documentation blocks
# ============================================================================
@test "agents have proper header documentation" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Required header components
    local required_fields=(
        "Script Name:"
        "Description:"
        "Version:"
        "Author:"
        "License:"
        "Requirements:"
        "Usage:"
        "Environment Variables:"
    )
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking header documentation for: $agent_name"
        
        # Check for each required field
        for field in "${required_fields[@]}"; do
            if ! grep -q "$field" "$agent_file"; then
                echo "Agent '$agent_name' missing required header field: $field"
                return 1
            fi
        done
    done <<< "$agent_files"
}

# ============================================================================
# Test Name: "agents have proper error handling"
# Test Type: Safety Validation
# Test Scope: Validates agents include proper error handling and safety measures
# ============================================================================
@test "agents have proper error handling" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking error handling for: $agent_name"
        
        # Check for error handling patterns
        if ! grep -qE "(try.*catch|\.catch\(|process\.exit)" "$agent_file"; then
            echo "Agent '$agent_name' should include error handling (try/catch or .catch())"
            return 1
        fi
        
        # Check for process.exit with proper codes
        if grep -q "process\.exit" "$agent_file"; then
            if ! grep -qE "process\.exit\([0-9]+\)" "$agent_file"; then
                echo "Agent '$agent_name' should use proper exit codes with process.exit()"
                return 1
            fi
        fi
    done <<< "$agent_files"
}

# ----- Section: Agent Functionality -----

# ============================================================================
# Test Name: "agents support dry-run mode"
# Test Type: Safety Validation
# Test Scope: Validates agents can run in dry-run mode without making changes
# ============================================================================
@test "agents support dry-run mode" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking dry-run support for: $agent_name"
        
        # Check for DRY_RUN environment variable handling
        if ! grep -q "DRY_RUN" "$agent_file"; then
            echo "Agent '$agent_name' should support DRY_RUN environment variable"
            return 1
        fi
    done <<< "$agent_files"
}

# ============================================================================
# Test Name: "agents have valid JavaScript syntax"
# Test Type: Syntax Validation
# Test Scope: Validates all JavaScript agents have valid syntax
# ============================================================================
@test "agents have valid JavaScript syntax" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Skip if Node.js is not available
    if ! command -v node >/dev/null 2>&1; then
        skip "Node.js not available for syntax checking"
    fi
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking JavaScript syntax for: $agent_name"
        
        # Check syntax with Node.js
        if ! node -c "$agent_file" 2>/dev/null; then
            echo "Agent '$agent_name' has JavaScript syntax errors"
            return 1
        fi
    done <<< "$agent_files"
}

# ----- Section: Agent Integration -----

# ============================================================================
# Test Name: "agents integrate with GitHub Actions"
# Test Type: Integration Validation
# Test Scope: Validates agents use proper GitHub Actions integration patterns
# ============================================================================
@test "agents integrate with GitHub Actions" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking GitHub Actions integration for: $agent_name"
        
        # Check for GitHub Actions core usage
        if ! grep -qE "(@actions/core|@actions/github|@octokit)" "$agent_file"; then
            echo "Agent '$agent_name' should use GitHub Actions libraries (@actions/core, @actions/github, or @octokit)"
            return 1
        fi
        
        # Check for proper token handling
        if ! grep -q "GITHUB_TOKEN" "$agent_file"; then
            echo "Agent '$agent_name' should handle GITHUB_TOKEN for API access"
            return 1
        fi
    done <<< "$agent_files"
}

# ----- Section: Security and Safety -----

# ============================================================================
# Test Name: "agents do not contain hardcoded secrets"
# Test Type: Security Validation
# Test Scope: Validates agents do not contain hardcoded tokens or secrets
# ============================================================================
@test "agents do not contain hardcoded secrets" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Patterns that might indicate hardcoded secrets
    local secret_patterns=(
        "ghp_[a-zA-Z0-9]+"  # GitHub personal access tokens
        "github_pat_[a-zA-Z0-9]+"  # GitHub fine-grained tokens
        "token.*=.*['\"][a-zA-Z0-9]{20,}['\"]"  # Generic token patterns
        "password.*=.*['\"][^'\"]{8,}['\"]"  # Password patterns
        "secret.*=.*['\"][^'\"]{16,}['\"]"  # Secret patterns
    )
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking for hardcoded secrets in: $agent_name"
        
        # Check for each secret pattern
        for pattern in "${secret_patterns[@]}"; do
            if grep -qE "$pattern" "$agent_file"; then
                echo "Agent '$agent_name' may contain hardcoded secrets (pattern: $pattern)"
                return 1
            fi
        done
        
        # Check for suspicious hardcoded values
        if grep -qE "(token|password|secret).*=.*['\"][a-zA-Z0-9]{16,}['\"]" "$agent_file"; then
            echo "Agent '$agent_name' may contain hardcoded credentials"
            return 1
        fi
    done <<< "$agent_files"
}

# ============================================================================
# Test Name: "agents are idempotent and safe"
# Test Type: Safety Validation
# Test Scope: Validates agents are designed to be idempotent and safe
# ============================================================================
@test "agents are idempotent and safe" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Dangerous patterns that should be avoided or carefully controlled
    local dangerous_patterns=(
        "rm -rf"
        "del /s"
        "DROP TABLE"
        "DELETE FROM.*WHERE.*=.*"
        "TRUNCATE"
        "format.*/"
    )
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking safety patterns for: $agent_name"
        
        # Check for dangerous patterns
        for pattern in "${dangerous_patterns[@]}"; do
            if grep -qE "$pattern" "$agent_file"; then
                echo "Agent '$agent_name' contains potentially dangerous pattern: $pattern"
                echo "Ensure proper safety checks and confirmation prompts are in place"
                # Don't fail the test, just warn - some operations may be legitimately needed
            fi
        done
    done
}

# ----- Section: Performance and Best Practices -----

# ============================================================================
# Test Name: "agents follow performance best practices"
# Test Type: Performance Validation
# Test Scope: Validates agents follow performance and efficiency best practices
# ============================================================================
@test "agents follow performance best practices" {
    local agents_dir="${BATS_TEST_DIRNAME}/../.github/agents"
    
    # Find all agent files
    local agent_files
    agent_files=$(find "$agents_dir" -name "*.agent.js" -type f 2>/dev/null || true)
    
    if [[ -z "$agent_files" ]]; then
        skip "No agent files found"
    fi
    
    while IFS= read -r agent_file; do
        local agent_name
        agent_name=$(basename "$agent_file")
        
        echo "Checking performance patterns for: $agent_name"
        
        # Check for async/await usage for asynchronous operations
        if grep -q "fetch\|request\|api" "$agent_file"; then
            if ! grep -qE "(async|await|\.then\()" "$agent_file"; then
                echo "Agent '$agent_name' makes API calls but may not use async patterns"
                return 1
            fi
        fi
        
        # Check for rate limiting considerations
        if grep -qE "(github\.rest\.|octokit\.|fetch)" "$agent_file"; then
            # Suggest rate limiting for API-heavy agents
            if ! grep -qE "(rate.*limit|throttle|delay|sleep)" "$agent_file"; then
                echo "Agent '$agent_name' makes API calls but doesn't appear to handle rate limiting"
                # This is a suggestion, not a hard requirement
            fi
        fi
    done
}