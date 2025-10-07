/**
 * Registers the LSX Example Block
 *
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from '../block.json';

/**
 * Register the LSX Example Block
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
    edit: Edit,
    save,
});