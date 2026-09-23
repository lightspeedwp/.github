// Jest globalTeardown: fail if tests changed the working tree (#3498).
module.exports = require("./jest.working-tree-guard.cjs").teardown;
