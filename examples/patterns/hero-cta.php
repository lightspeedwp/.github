<?php
/**
 * Title: Hero Section with Call to Action
 * Slug: lsx/hero-cta
 * Categories: hero, call-to-action
 * Keywords: hero, banner, cta, call to action, featured
 * Block Types: core/post-content
 * Post Types: page
 * Viewport width: 1376
 * Description: A hero section with a prominent headline, description, and call-to-action button.
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

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}},"color":{"gradient":"linear-gradient(135deg,var(--wp--preset--color--primary) 0%,var(--wp--preset--color--secondary) 100%)"}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group alignfull has-background" style="background:linear-gradient(135deg,var(--wp--preset--color--primary) 0%,var(--wp--preset--color--secondary) 100%);margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">
    <!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
    <div class="wp-block-group">
        <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"700","lineHeight":"1.2"},"color":{"text":"var:preset|color|white"},"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} -->
        <h1 class="wp-block-heading has-text-align-center has-white-color has-text-color" style="margin-bottom:var(--wp--preset--spacing--30);font-size:3.5rem;font-weight:700;line-height:1.2"><?php echo esc_html__( 'Transform Your WordPress Experience', 'lsx-theme' ); ?></h1>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"align":"center","style":{"color":{"text":"var:preset|color|white"},"typography":{"fontSize":"1.25rem","lineHeight":"1.6"},"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
        <p class="has-text-align-center has-white-color has-text-color" style="margin-bottom:var(--wp--preset--spacing--50);font-size:1.25rem;line-height:1.6"><?php echo esc_html__( 'Discover powerful, accessible, and performance-optimized WordPress solutions that help your business thrive in the digital landscape.', 'lsx-theme' ); ?></p>
        <!-- /wp:paragraph -->

        <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
        <div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
            <!-- wp:button {"backgroundColor":"white","textColor":"primary","style":{"typography":{"fontSize":"1.125rem","fontWeight":"600"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"50px"}},"className":"is-style-fill"} -->
            <div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background wp-element-button" style="border-radius:50px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--40);font-size:1.125rem;font-weight:600"><?php echo esc_html__( 'Get Started Today', 'lsx-theme' ); ?></a></div>
            <!-- /wp:button -->

            <!-- wp:button {"textColor":"white","style":{"typography":{"fontSize":"1.125rem","fontWeight":"600"},"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}},"border":{"radius":"50px","color":"var:preset|color|white","width":"2px"}},"className":"is-style-outline"} -->
            <div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-white-color has-text-color has-border-color wp-element-button" style="border-color:var(--wp--preset--color--white);border-width:2px;border-radius:50px;padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--40);font-size:1.125rem;font-weight:600"><?php echo esc_html__( 'Learn More', 'lsx-theme' ); ?></a></div>
            <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)">
    <!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|50","left":"var:preset|spacing|60"}}}} -->
    <div class="wp-block-columns alignwide">
        <!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}}} -->
        <div class="wp-block-column" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
            <!-- wp:heading {"textAlign":"center","level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"},"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
            <h3 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20);font-size:1.5rem;font-weight:600"><?php echo esc_html__( 'Performance First', 'lsx-theme' ); ?></h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":"1.6"}}} -->
            <p class="has-text-align-center" style="line-height:1.6"><?php echo esc_html__( 'Built with performance in mind, our solutions ensure your website loads fast and ranks well.', 'lsx-theme' ); ?></p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}}} -->
        <div class="wp-block-column" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
            <!-- wp:heading {"textAlign":"center","level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"},"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
            <h3 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20);font-size:1.5rem;font-weight:600"><?php echo esc_html__( 'Accessible Design', 'lsx-theme' ); ?></h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":"1.6"}}} -->
            <p class="has-text-align-center" style="line-height:1.6"><?php echo esc_html__( 'Every component is designed with accessibility in mind, ensuring everyone can use your site.', 'lsx-theme' ); ?></p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}}} -->
        <div class="wp-block-column" style="padding-top:var(--wp--preset--spacing--30);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30);padding-left:var(--wp--preset--spacing--30)">
            <!-- wp:heading {"textAlign":"center","level":3,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"600"},"spacing":{"margin":{"bottom":"var:preset|spacing|20"}}}} -->
            <h3 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--20);font-size:1.5rem;font-weight:600"><?php echo esc_html__( 'Easy to Use', 'lsx-theme' ); ?></h3>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":"1.6"}}} -->
            <p class="has-text-align-center" style="line-height:1.6"><?php echo esc_html__( 'Intuitive interfaces and clear documentation make our tools easy to use for everyone.', 'lsx-theme' ); ?></p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->