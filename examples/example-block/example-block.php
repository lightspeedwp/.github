<?php
/**
 * LSX Example Block Registration
 *
 * This file demonstrates the proper way to register a WordPress block
 * following LightSpeed coding standards and WordPress best practices.
 *
 * @package     LSX_Example_Block
 * @since       1.0.0
 * @author      LightSpeed WP
 * @link        https://lightspeedwp.agency
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register LSX Example Block
 *
 * @since 1.0.0
 */
function lsx_register_example_block() {
    // Register the block using block.json.
    register_block_type( __DIR__ . '/block.json' );
}
add_action( 'init', 'lsx_register_example_block' );

/**
 * Register block category for LSX blocks
 *
 * @param array $categories Array of block categories.
 * @return array Modified array of block categories.
 * @since 1.0.0
 */
function lsx_register_block_category( $categories ) {
    // Check if category already exists.
    foreach ( $categories as $category ) {
        if ( 'lsx-blocks' === $category['slug'] ) {
            return $categories;
        }
    }

    // Add LSX blocks category.
    return array_merge(
        $categories,
        array(
            array(
                'slug'  => 'lsx-blocks',
                'title' => esc_html__( 'LSX Blocks', 'lsx-theme' ),
                'icon'  => 'admin-customizer',
            ),
        )
    );
}
add_filter( 'block_categories_all', 'lsx_register_block_category' );

/**
 * Enqueue block assets for editor and frontend
 *
 * @since 1.0.0
 */
function lsx_example_block_assets() {
    // Only load in admin/editor.
    if ( ! is_admin() ) {
        return;
    }

    // Get asset file for dependency and version management.
    $asset_file = include __DIR__ . '/build/index.asset.php';

    // Enqueue block editor script.
    wp_enqueue_script(
        'lsx-example-block-editor',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version'],
        true
    );

    // Enqueue editor styles.
    wp_enqueue_style(
        'lsx-example-block-editor',
        plugins_url( 'build/editor.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        $asset_file['version']
    );

    // Localize script for translations.
    wp_set_script_translations(
        'lsx-example-block-editor',
        'lsx-theme',
        __DIR__ . '/languages'
    );
}
add_action( 'enqueue_block_editor_assets', 'lsx_example_block_assets' );

/**
 * Enqueue frontend block styles
 *
 * @since 1.0.0
 */
function lsx_example_block_frontend_assets() {
    // Get asset file for version management.
    $asset_file = include __DIR__ . '/build/index.asset.php';

    // Enqueue frontend styles.
    wp_enqueue_style(
        'lsx-example-block-style',
        plugins_url( 'build/style.css', __FILE__ ),
        array(),
        $asset_file['version']
    );
}
add_action( 'wp_enqueue_scripts', 'lsx_example_block_frontend_assets' );

/**
 * Add custom attributes to block wrapper
 *
 * @param string $block_content The block content.
 * @param array  $block         The full block, including name and attributes.
 * @return string Modified block content.
 * @since 1.0.0
 */
function lsx_example_block_wrapper_attributes( $block_content, $block ) {
    // Only apply to our block.
    if ( 'lsx/example-block' !== $block['blockName'] ) {
        return $block_content;
    }

    // Add custom CSS classes or data attributes if needed.
    $custom_attributes = '';
    
    // Example: Add schema markup.
    $custom_attributes .= ' itemscope itemtype="https://schema.org/CreativeWork"';
    
    // Add attributes to the block wrapper.
    $block_content = str_replace(
        'class="wp-block-lsx-example-block',
        'class="wp-block-lsx-example-block' . $custom_attributes . ' ',
        $block_content
    );

    return $block_content;
}
add_filter( 'render_block', 'lsx_example_block_wrapper_attributes', 10, 2 );

/**
 * Server-side rendering callback (if needed for dynamic blocks)
 *
 * @param array $attributes Block attributes.
 * @return string Block output.
 * @since 1.0.0
 */
function lsx_example_block_render_callback( $attributes ) {
    // Sanitize attributes.
    $content = isset( $attributes['content'] ) ? wp_kses_post( $attributes['content'] ) : '';
    $alignment = isset( $attributes['alignment'] ) ? esc_attr( $attributes['alignment'] ) : 'center';
    $background_color = isset( $attributes['backgroundColor'] ) ? esc_attr( $attributes['backgroundColor'] ) : '';
    $text_color = isset( $attributes['textColor'] ) ? esc_attr( $attributes['textColor'] ) : '';

    // Build inline styles.
    $styles = array();
    if ( $background_color ) {
        $styles[] = 'background-color: ' . $background_color;
    }
    if ( $text_color ) {
        $styles[] = 'color: ' . $text_color;
    }
    $style_attr = ! empty( $styles ) ? ' style="' . esc_attr( implode( '; ', $styles ) ) . '"' : '';

    // Build CSS classes.
    $classes = array(
        'wp-block-lsx-example-block',
        'has-text-align-' . $alignment,
    );

    // Output the block.
    ob_start();
    ?>
    <div class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"<?php echo $style_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
        <p><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
    </div>
    <?php
    return ob_get_clean();
}

// Uncomment the following line if you want to use server-side rendering:
// register_block_type( 'lsx/example-block', array( 'render_callback' => 'lsx_example_block_render_callback' ) );