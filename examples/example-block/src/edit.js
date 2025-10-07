/**
 * Edit component for LSX Example Block
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    BlockControls,
    AlignmentToolbar,
    PanelColorSettings,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
} from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const { content, alignment, backgroundColor, textColor } = attributes;

    const blockProps = useBlockProps({
        className: `has-text-align-${alignment}`,
        style: {
            backgroundColor: backgroundColor,
            color: textColor,
        },
    });

    const onChangeContent = (newContent) => {
        setAttributes({ content: newContent });
    };

    const onChangeAlignment = (newAlignment) => {
        setAttributes({ alignment: newAlignment || 'center' });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={__('Block Settings', 'lsx-theme')}
                    initialOpen={true}
                >
                    <PanelRow>
                        <p>{__('Customize your example block appearance.', 'lsx-theme')}</p>
                    </PanelRow>
                </PanelBody>
                <PanelColorSettings
                    title={__('Color Settings', 'lsx-theme')}
                    colorSettings={[
                        {
                            value: backgroundColor,
                            onChange: (color) => setAttributes({ backgroundColor: color }),
                            label: __('Background Color', 'lsx-theme'),
                        },
                        {
                            value: textColor,
                            onChange: (color) => setAttributes({ textColor: color }),
                            label: __('Text Color', 'lsx-theme'),
                        },
                    ]}
                />
            </InspectorControls>

            <BlockControls>
                <AlignmentToolbar
                    value={alignment}
                    onChange={onChangeAlignment}
                />
            </BlockControls>

            <div {...blockProps}>
                <RichText
                    tagName="p"
                    value={content}
                    onChange={onChangeContent}
                    placeholder={__('Enter your content here...', 'lsx-theme')}
                    allowedFormats={['core/bold', 'core/italic', 'core/link']}
                />
            </div>
        </>
    );
}