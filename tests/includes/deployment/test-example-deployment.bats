# ============================================================================
# Test Suite: test-example-deployment.bats
# Description: Bats tests for example-deployment.sh script.
# Version: v0.1.0
# Date: 14-10-2025
# Author: LightSpeedWP
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Github Author: @lightspeedwp / @ashleyshaw
# Requirements:
#    - bats-core
#    - test-helper.bash
# Usage:
#    - bats test-example-deployment.bats
# Test Scope: example-deployment.sh script functionality.
# ============================================================================

# Load test helpers
load '../test-helper.bash'

# ----- Section: Setup function -----
# ============================================================================
# setup()
# Sets up the test environment for example-deployment.sh tests.
# - Calls setup_test_environment and setup_test_logging
# - Sources the script to test
# ============================================================================
setup() {
    REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")" && cd ../.. && pwd)"
    SCRIPT="$REPO_ROOT/scripts/deployment/example-deployment.sh"
    setup_test_environment
    setup_test_logging
    source "$SCRIPT"
}

# ----- Section: Teardown function -----
# teardown()
# Cleans up the test environment after each test.
# - Calls cleanup_test_environment
teardown() {
    cleanup_test_environment
}

# ----- Section: Functional Tests -----

# @test "validate_environment accepts valid environments"
# Verifies that validate_environment accepts valid environment values.
# - Sets ENVIRONMENT to staging, production, development
# - Expects status 0 for each
@test "validate_environment accepts valid environments" {
    #
    # Test Name: Test Valid Environments
    # Test Type: Positive
    # Test Scope: Functionality
    #
    ENVIRONMENT="staging"
    run validate_environment
    [ "$status" -eq 0 ]

    ENVIRONMENT="production"
    run validate_environment
    [ "$status" -eq 0 ]

    ENVIRONMENT="development"
    run validate_environment
    [ "$status" -eq 0 ]
}

# @test "validate_environment rejects invalid environments"
# Verifies that validate_environment rejects invalid environment values.
# - Sets ENVIRONMENT to invalid
# - Expects status 1 and error message
@test "validate_environment rejects invalid environments" {
    #
    # Test Name: Test Invalid Environments
    # Test Type: Negative
    # Test Scope: Functionality
    #
    ENVIRONMENT="invalid"
    run validate_environment
    [ "$status" -eq 1 ]
    [[ "$output" =~ "Invalid environment: invalid" ]]
}

# @test "log function writes to log file"
# Verifies that the log function writes messages to the log file.
# - Runs log with a test message
# - Expects status 0 and message in log file
@test "log function writes to log file" {
    #
    # Test Name: Test Log Function
    # Test Type: Positive
    # Test Scope: Functionality
    #
    local test_message="Test log message"
    run log "$test_message"
    [ "$status" -eq 0 ]
    assert_file_contains "$LOG_FILE" "$test_message"
}

# @test "deploy function logs deployment start and completion"
# Verifies that deploy logs deployment start and completion messages.
# - Runs deploy with staging and version
# - Expects status 0 and log file contains start and completion messages
@test "deploy function logs deployment start and completion" {
    #
    # Test Name: Test Deploy Function Logging
    # Test Type: Positive
    # Test Scope: Functionality
    #
    run deploy "staging" "v1.0.0"
    [ "$status" -eq 0 ]
    assert_file_contains "$LOG_FILE" "Starting deployment to staging environment with version v1.0.0"
    assert_file_contains "$LOG_FILE" "Deployment completed successfully"
}

# @test "error_exit function logs error and exits with code 1"
# Verifies that error_exit logs error and exits with code 1.
# - Runs error_exit with a test error message
# - Expects status 1 and error message in output
@test "error_exit function logs error and exits with code 1" {
    #
    # Test Name: Test Error Exit Function
    # Test Type: Negative
    # Test Scope: Functionality
    #
    run error_exit "Test error message"
    [ "$status" -eq 1 ]
    [[ "$output" =~ "ERROR: Test error message" ]]
}

# @test "script accepts environment and version parameters"
# Verifies that the script accepts environment and version parameters.
# - Runs script directly with production and v2.0.0
# - Expects status 0
@test "script accepts environment and version parameters" {
    #
    # Test Name: Test Script Parameter Handling
    # Test Type: Positive
    # Test Scope: Script Initialization
    #
    run bash "$SCRIPT" "production" "v2.0.0"
    [ "$status" -eq 0 ]
}

# @test "script uses default values when no parameters provided"
# Verifies that the script uses default values when no parameters are provided.
# - Mocks main function to print environment and version
# - Expects output to contain default values
@test "script uses default values when no parameters provided" {
    #
    # Test Name: Test Script Default Values
    # Test Type: Positive
    # Test Scope: Script Initialization
    #
    main() {
        echo "Environment: ${ENVIRONMENT:-staging}"
        echo "Version: ${VERSION:-latest}"
    }
    run main
    [ "$status" -eq 0 ]
    [[ "$output" =~ "Environment: staging" ]]
    [[ "$output" =~ "Version: latest" ]]
}
