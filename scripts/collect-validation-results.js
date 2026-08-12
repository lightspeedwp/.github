#!/usr/bin/env node
/**
 * Collect validation results from multiple check steps
 * Reads: SYNTAX_OUTCOME, A11Y_OUTCOME, CONTRAST_OUTCOME from env
 * Outputs: syntax_ok, a11y_ok, contrast_ok, all_passed
 */

const syntaxOutcome = process.env.SYNTAX_OUTCOME || "failure";
const a11yOutcome = process.env.A11Y_OUTCOME || "failure";
const contrastOutcome = process.env.CONTRAST_OUTCOME || "failure";

const syntaxOk = syntaxOutcome === "success";
const a11yOk = a11yOutcome === "success";
const contrastOk = contrastOutcome === "success";
const allPassed = syntaxOk && a11yOk && contrastOk;

console.log(`syntax_ok=${syntaxOk}`);
console.log(`a11y_ok=${a11yOk}`);
console.log(`contrast_ok=${contrastOk}`);
console.log(`all_passed=${allPassed}`);
