/**
 * Checklist Template Library
 * Main entry point for all validators, classifiers, and utilities
 */

const itemValidator = require('./item-validator');
const dimensionClassifier = require('./dimension-classifier');
const checkboxParser = require('./checkbox-parser');
const completenessCalculator = require('./completeness-calculator');
const traceabilityLinker = require('./traceability-linker');

module.exports = {
  // Item Validation
  validateItem: itemValidator.validateItem,
  validateItems: itemValidator.validateItems,
  isValidItemId: itemValidator.isValidItemId,

  // Dimension Classification
  getDimension: dimensionClassifier.getDimension,
  classifyByDimension: dimensionClassifier.classifyByDimension,
  getDimensionStats: dimensionClassifier.getDimensionStats,
  getDimensionNames: dimensionClassifier.getDimensionNames,

  // Checkbox Parsing
  parseCheckboxLine: checkboxParser.parseCheckboxLine,
  parseCheckboxes: checkboxParser.parseCheckboxes,
  countCheckboxes: checkboxParser.countCheckboxes,
  findItemById: checkboxParser.findItemById,

  // Completeness Calculation
  calculateMetrics: completenessCalculator.calculateMetrics,
  determineStatus: completenessCalculator.determineStatus,
  calculateReport: completenessCalculator.calculateReport,
  isGoodEnoughToImplement: completenessCalculator.isGoodEnoughToImplement,

  // Traceability
  parseSpecReference: traceabilityLinker.parseSpecReference,
  createTraceabilityMatrix: traceabilityLinker.createTraceabilityMatrix,
  getGaps: traceabilityLinker.getGaps,
  getAmbiguities: traceabilityLinker.getAmbiguities,
  generateReport: traceabilityLinker.generateReport,

  // Modules for direct access
  itemValidator,
  dimensionClassifier,
  checkboxParser,
  completenessCalculator,
  traceabilityLinker,
};
