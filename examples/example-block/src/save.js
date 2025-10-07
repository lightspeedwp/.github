/**
 * Save component for LSX Example Block
 *
 * @since 1.0.0
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into post_content.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Properties passed to the function.
 * @param {Object} props.attributes Available block attributes.
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
    const { content, alignment, backgroundColor, textColor } = attributes;

    const blockProps = useBlockProps.save({
        className: `has-text-align-${alignment}`,
        style: {
            backgroundColor: backgroundColor,
            color: textColor,
        },
    });

    return (
        <div {...blockProps}>
            <RichText.Content
                tagName="p"
                value={content}
            />
        </div>
    );
}