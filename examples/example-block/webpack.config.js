/**
 * WordPress webpack configuration
 * 
 * This file extends the default @wordpress/scripts webpack config
 * following LightSpeed standards.
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    // Additional configuration can be added here if needed
    // For most blocks, the default WordPress config is sufficient
};