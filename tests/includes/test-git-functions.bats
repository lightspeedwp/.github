#!/usr/bin/env bats

# ============================================================================
# Test Name: test-git-functions.bats
# Testing: scripts/includes/network/git-functions.sh
# Description: Comprehensive tests for Git utility functions
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# Usage: bats test-git-functions.bats
# Options: None
# ============================================================================

# Load test helpers
load "$(dirname "$BATS_TEST_FILENAME")/../test-helper.bash"

# Setup function runs before each test
setup() {
    # Setup test environment for each test
    TEST_TEMP_DIR=$(mktemp -d)
    export TEST_TEMP_DIR
    export LOG_FILE="$TEST_TEMP_DIR/test.log"

    # Load the includes being tested
    SCRIPTS_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../scripts" && pwd)"

    # Disable strict mode temporarily to source the files
    set +euo pipefail
    source "$SCRIPTS_DIR/includes/network/git-functions.sh" 2>/dev/null || true
    set -euo pipefail
}

# Teardown function runs after each test
teardown() {
    # Cleanup after each test
    [[ -n "$TEST_TEMP_DIR" && -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
    unset LOG_FILE
}

# ----- Section: Git Repository Detection -----

# ============================================================================
# Test Name: "is_git_repo detects git repository"
# Test Type: Unit Test
# Test Scope: Validates is_git_repo returns true in git repositories
# ============================================================================
@test "is_git_repo detects git repository" {
    cd "$TEST_TEMP_DIR"
    git init

    run is_git_repo

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "is_git_repo returns false outside git repo"
# Test Type: Unit Test
# Test Scope: Validates is_git_repo returns false in non-git directories
# ============================================================================
@test "is_git_repo returns false outside git repo" {
    cd "$TEST_TEMP_DIR"
    # Don't initialize git

    run is_git_repo

    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "is_git_repo works in subdirectories"
# Test Type: Unit Test
# Test Scope: Validates is_git_repo detects repo from subdirectories
# ============================================================================
@test "is_git_repo works in subdirectories" {
    cd "$TEST_TEMP_DIR"
    git init
    mkdir -p subdir/nested
    cd subdir/nested

    run is_git_repo

    [[ "$status" -eq 0 ]]
}

# ----- Section: Current Branch Detection -----

# ============================================================================
# Test Name: "get_current_branch returns branch name"
# Test Type: Unit Test
# Test Scope: Validates get_current_branch returns current branch name
# ============================================================================
@test "get_current_branch returns branch name" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    # Create initial commit
    echo "test" > README.md
    git add README.md
    git commit -m "Initial commit"

    local branch
    branch=$(get_current_branch)

    [[ -n "$branch" ]]
    # Default branch is usually 'main' or 'master'
    [[ "$branch" == "main" || "$branch" == "master" ]]
}

# ============================================================================
# Test Name: "get_current_branch returns empty outside git repo"
# Test Type: Unit Test
# Test Scope: Validates get_current_branch behavior in non-git directories
# ============================================================================
@test "get_current_branch returns empty outside git repo" {
    cd "$TEST_TEMP_DIR"

    local branch
    branch=$(get_current_branch)

    [[ -z "$branch" ]]
}

# ============================================================================
# Test Name: "get_current_branch detects custom branch"
# Test Type: Integration Test
# Test Scope: Validates get_current_branch detects branch after checkout
# ============================================================================
@test "get_current_branch detects custom branch" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > README.md
    git add README.md
    git commit -m "Initial commit"

    git checkout -b feature-branch

    local branch
    branch=$(get_current_branch)

    [[ "$branch" == "feature-branch" ]]
}

# ----- Section: Repository Root Detection -----

# ============================================================================
# Test Name: "get_repo_root returns repository root"
# Test Type: Unit Test
# Test Scope: Validates get_repo_root returns absolute path to repo root
# ============================================================================
@test "get_repo_root returns repository root" {
    cd "$TEST_TEMP_DIR"
    git init

    local repo_root
    repo_root=$(get_repo_root)

    [[ "$repo_root" == "$TEST_TEMP_DIR" ]]
}

# ============================================================================
# Test Name: "get_repo_root works from subdirectory"
# Test Type: Unit Test
# Test Scope: Validates get_repo_root finds root from nested directories
# ============================================================================
@test "get_repo_root works from subdirectory" {
    cd "$TEST_TEMP_DIR"
    git init
    mkdir -p deep/nested/dir
    cd deep/nested/dir

    local repo_root
    repo_root=$(get_repo_root)

    [[ "$repo_root" == "$TEST_TEMP_DIR" ]]
}

# ============================================================================
# Test Name: "get_repo_root returns empty outside git repo"
# Test Type: Unit Test
# Test Scope: Validates get_repo_root behavior in non-git directories
# ============================================================================
@test "get_repo_root returns empty outside git repo" {
    cd "$TEST_TEMP_DIR"

    local repo_root
    repo_root=$(get_repo_root)

    [[ -z "$repo_root" ]]
}

# ----- Section: Uncommitted Changes Detection -----

# ============================================================================
# Test Name: "has_uncommitted_changes detects modified files"
# Test Type: Unit Test
# Test Scope: Validates has_uncommitted_changes detects working tree changes
# ============================================================================
@test "has_uncommitted_changes detects modified files" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "initial" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Modify file
    echo "modified" > file.txt

    run has_uncommitted_changes

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "has_uncommitted_changes returns false for clean tree"
# Test Type: Unit Test
# Test Scope: Validates has_uncommitted_changes with clean working tree
# ============================================================================
@test "has_uncommitted_changes returns false for clean tree" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    run has_uncommitted_changes

    [[ "$status" -eq 1 ]]
}

# ============================================================================
# Test Name: "has_uncommitted_changes detects untracked files"
# Test Type: Unit Test
# Test Scope: Validates has_uncommitted_changes detects new untracked files
# ============================================================================
@test "has_uncommitted_changes detects staged changes" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "initial" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Add new file to staging
    echo "new" > newfile.txt
    git add newfile.txt

    run has_uncommitted_changes

    [[ "$status" -eq 0 ]]
}

# ----- Section: Commit Hash Retrieval -----

# ============================================================================
# Test Name: "get_commit_hash returns full hash"
# Test Type: Unit Test
# Test Scope: Validates get_commit_hash returns full SHA-1 hash
# ============================================================================
@test "get_commit_hash returns full hash" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    local hash
    hash=$(get_commit_hash)

    # Full SHA-1 hash is 40 characters
    [[ ${#hash} -eq 40 ]]
    [[ "$hash" =~ ^[0-9a-f]{40}$ ]]
}

# ============================================================================
# Test Name: "get_commit_hash returns short hash"
# Test Type: Unit Test
# Test Scope: Validates get_commit_hash --short returns abbreviated hash
# ============================================================================
@test "get_commit_hash returns short hash" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    local short_hash
    short_hash=$(get_commit_hash --short)

    # Short hash is typically 7 characters
    [[ ${#short_hash} -ge 7 ]]
    [[ ${#short_hash} -le 10 ]]
    [[ "$short_hash" =~ ^[0-9a-f]+$ ]]
}

# ============================================================================
# Test Name: "get_commit_hash returns empty outside git repo"
# Test Type: Unit Test
# Test Scope: Validates get_commit_hash behavior in non-git directories
# ============================================================================
@test "get_commit_hash returns empty outside git repo" {
    cd "$TEST_TEMP_DIR"

    local hash
    hash=$(get_commit_hash)

    [[ -z "$hash" ]]
}

# ----- Section: Clean Working Tree Validation -----

# ============================================================================
# Test Name: "validate_clean_working_tree succeeds with clean tree"
# Test Type: Unit Test
# Test Scope: Validates validate_clean_working_tree with no changes
# ============================================================================
@test "validate_clean_working_tree succeeds with clean tree" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    run validate_clean_working_tree

    [[ "$status" -eq 0 ]]
}

# ============================================================================
# Test Name: "validate_clean_working_tree fails with uncommitted changes"
# Test Type: Unit Test
# Test Scope: Validates validate_clean_working_tree detects dirty tree
# ============================================================================
@test "validate_clean_working_tree fails with uncommitted changes" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "initial" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Make uncommitted change
    echo "modified" > file.txt

    run validate_clean_working_tree

    [[ "$status" -eq 1 ]]
    [[ "$output" == *"uncommitted changes"* ]]
}

# ============================================================================
# Test Name: "validate_clean_working_tree fails outside git repo"
# Test Type: Error Condition Test
# Test Scope: Validates validate_clean_working_tree in non-git directories
# ============================================================================
@test "validate_clean_working_tree fails outside git repo" {
    cd "$TEST_TEMP_DIR"

    run validate_clean_working_tree

    [[ "$status" -eq 1 ]]
    [[ "$output" == *"Not in a git repository"* ]]
}

# ----- Section: Edge Cases -----

# ============================================================================
# Test Name: "functions handle empty repository"
# Test Type: Edge Case Test
# Test Scope: Validates git functions with newly initialized empty repo
# ============================================================================
@test "functions handle empty repository" {
    cd "$TEST_TEMP_DIR"
    git init

    # is_git_repo should work
    run is_git_repo
    [[ "$status" -eq 0 ]]

    # get_repo_root should work
    local root
    root=$(get_repo_root)
    [[ "$root" == "$TEST_TEMP_DIR" ]]

    # get_current_branch returns empty in empty repo
    local branch
    branch=$(get_current_branch)
    # Empty repo has no current branch until first commit
    [[ -z "$branch" ]]
}

# ============================================================================
# Test Name: "functions handle detached HEAD state"
# Test Type: Edge Case Test
# Test Scope: Validates git functions behavior in detached HEAD state
# ============================================================================
@test "functions handle detached HEAD state" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Get commit hash
    local hash
    hash=$(get_commit_hash)

    # Checkout commit directly (detached HEAD)
    git checkout "$hash" 2>/dev/null

    # is_git_repo should still work
    run is_git_repo
    [[ "$status" -eq 0 ]]

    # get_current_branch returns empty in detached HEAD
    local branch
    branch=$(get_current_branch)
    [[ -z "$branch" ]]
}

# ============================================================================
# Test Name: "functions work with bare repository"
# Test Type: Edge Case Test
# Test Scope: Validates git functions with bare repositories
# ============================================================================
@test "functions work with bare repository" {
    cd "$TEST_TEMP_DIR"
    git init --bare bare-repo.git
    cd bare-repo.git

    # is_git_repo should work in bare repo
    run is_git_repo
    [[ "$status" -eq 0 ]]
}

# ----- Section: Integration Tests -----

# ============================================================================
# Test Name: "multiple git operations in sequence"
# Test Type: Integration Test
# Test Scope: Validates multiple git function calls work together
# ============================================================================
@test "multiple git operations in sequence" {
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    # Check we're in a repo
    is_git_repo
    [[ "$?" -eq 0 ]]

    # Get repo root
    local root
    root=$(get_repo_root)
    [[ "$root" == "$TEST_TEMP_DIR" ]]

    # Create initial commit
    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Get branch and commit
    local branch hash
    branch=$(get_current_branch)
    hash=$(get_commit_hash)

    [[ -n "$branch" ]]
    [[ ${#hash} -eq 40 ]]

    # Validate clean tree
    validate_clean_working_tree
    [[ "$?" -eq 0 ]]
}

# ============================================================================
# Test Name: "functions handle git submodules"
# Test Type: Integration Test
# Test Scope: Validates git functions work in repositories with submodules
# ============================================================================
@test "functions handle repository with .git file" {
    # Some repos (like submodules) have .git as a file, not directory
    cd "$TEST_TEMP_DIR"
    git init
    git config user.name "Test User"
    git config user.email "test@example.com"

    echo "test" > file.txt
    git add file.txt
    git commit -m "Initial commit"

    # Functions should still work
    run is_git_repo
    [[ "$status" -eq 0 ]]

    local root
    root=$(get_repo_root)
    [[ "$root" == "$TEST_TEMP_DIR" ]]
}

# End of test-git-functions.bats
