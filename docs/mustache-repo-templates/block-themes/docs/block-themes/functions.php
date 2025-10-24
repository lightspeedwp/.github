<?php
/**
 * Functions for {{theme_name}}
 */

add_action( 'wp_enqueue_scripts', function() {
    $asset = include get_theme_file_path( 'public/css/screen.asset.php' );
    wp_enqueue_style(
        '{{theme_slug}}-style',
        get_theme_file_uri( 'public/css/screen.css' ),
        $asset['dependencies'],
        $asset['version']
    );
});

add_action( 'enqueue_block_editor_assets', function() {
    $asset = include get_theme_file_path( 'public/css/editor.asset.php' );
    wp_enqueue_style(
        '{{theme_slug}}-editor-style',
        get_theme_file_uri( 'public/css/editor.css' ),
        $asset['dependencies'],
        $asset['version']
    );
});