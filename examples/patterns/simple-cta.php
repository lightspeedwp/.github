<?php
/**
 * Title: Simple Call to Action
 * Slug: lsx/simple-cta
 * Categories: call-to-action
 * Keywords: cta, button, action, simple
 * Viewport width: 1376
 * Description: A simple call-to-action section with text and button.
 *
 * @package     LSX_Patterns
 * @since       1.0.0
 * @author      LightSpeed WP
 * @link        https://lightspeedwp.agency
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"light-gray","layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group has-light-gray-background-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)">
    <!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":"2rem","fontWeight":"600"},"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} -->
    <h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--30);font-size:2rem;font-weight:600"><?php echo esc_html__( 'Ready to Get Started?', 'lsx-theme' ); ?></h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.125rem","lineHeight":"1.6"},"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} -->
    <p class="has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--40);font-size:1.125rem;line-height:1.6"><?php echo esc_html__( 'Join thousands of satisfied customers who have transformed their WordPress experience with our solutions.', 'lsx-theme' ); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:button {"backgroundColor":"primary","textColor":"white","style":{"typography":{"fontSize":"1.125rem","fontWeight":"600"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}}} -->
        <div class="wp-block-button"><a class="wp-block-button__link has-white-color has-primary-background-color has-text-color has-background wp-element-button" style="border-radius:8px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50);font-size:1.125rem;font-weight:600"><?php echo esc_html__( 'Start Your Journey', 'lsx-theme' ); ?></a></div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
</div>
<!-- /wp:group -->