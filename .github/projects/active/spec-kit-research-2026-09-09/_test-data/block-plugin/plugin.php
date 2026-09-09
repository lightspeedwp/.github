<?php
/**
 * Plugin Name: Sample Test Block
 * Plugin URI: https://example.com/sample-block
 * Description: A sample block for testing Spec Kit and OpenSpec compatibility
 * Version: 1.0.0
 * Author: Test Block Team
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: test-block
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 *
 * @package test-block
 */

namespace TestBlock;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the block.
 */
function register_blocks() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
