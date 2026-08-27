/**
 * Phase State Machine
 * Defines valid state transitions for OpenSpec status labels
 */

const STATES = {
  SPECIFICATION_PENDING: "openspec:specification-pending",
  SPECIFICATION_IN_PROGRESS: "openspec:specification-in-progress",
  SPECIFICATION_COMPLETE: "openspec:specification-complete",
  IMPLEMENTATION_PENDING: "openspec:implementation-pending",
  IMPLEMENTATION_IN_PROGRESS: "openspec:implementation-in-progress",
  IMPLEMENTATION_COMPLETE: "openspec:implementation-complete",
};

/**
 * Valid state transitions
 * Maps current state → array of valid next states
 */
const TRANSITIONS = {
  [STATES.SPECIFICATION_PENDING]: [
    STATES.SPECIFICATION_IN_PROGRESS,
    // Can return to pending if needed
    STATES.SPECIFICATION_PENDING,
  ],
  [STATES.SPECIFICATION_IN_PROGRESS]: [
    STATES.SPECIFICATION_COMPLETE,
    STATES.SPECIFICATION_PENDING, // Rollback
  ],
  [STATES.SPECIFICATION_COMPLETE]: [
    STATES.IMPLEMENTATION_PENDING,
    STATES.SPECIFICATION_IN_PROGRESS, // Rollback
  ],
  [STATES.IMPLEMENTATION_PENDING]: [
    STATES.IMPLEMENTATION_IN_PROGRESS,
    STATES.SPECIFICATION_COMPLETE, // Rollback to spec
    STATES.IMPLEMENTATION_PENDING,
  ],
  [STATES.IMPLEMENTATION_IN_PROGRESS]: [
    STATES.IMPLEMENTATION_COMPLETE,
    STATES.IMPLEMENTATION_PENDING, // Rollback
  ],
  [STATES.IMPLEMENTATION_COMPLETE]: [
    STATES.IMPLEMENTATION_IN_PROGRESS, // Rollback
    STATES.IMPLEMENTATION_COMPLETE,
  ],
};

/**
 * Triggers that cause automatic phase progression
 */
const PHASE_TRIGGERS = {
  // Specification phase triggers
  [STATES.SPECIFICATION_PENDING]: {
    "PR opened": STATES.SPECIFICATION_IN_PROGRESS,
    "status:in-progress added": STATES.SPECIFICATION_IN_PROGRESS,
  },
  [STATES.SPECIFICATION_IN_PROGRESS]: {
    "PR merged": STATES.SPECIFICATION_COMPLETE,
    "status:done added": STATES.SPECIFICATION_COMPLETE,
  },
  [STATES.SPECIFICATION_COMPLETE]: {
    "PR opened": STATES.IMPLEMENTATION_PENDING,
    "ready-for-implementation": STATES.IMPLEMENTATION_PENDING,
  },

  // Implementation phase triggers
  [STATES.IMPLEMENTATION_PENDING]: {
    "PR opened": STATES.IMPLEMENTATION_IN_PROGRESS,
    "status:in-progress added": STATES.IMPLEMENTATION_IN_PROGRESS,
  },
  [STATES.IMPLEMENTATION_IN_PROGRESS]: {
    "PR merged": STATES.IMPLEMENTATION_COMPLETE,
    "status:done added": STATES.IMPLEMENTATION_COMPLETE,
  },
  [STATES.IMPLEMENTATION_COMPLETE]: {
    // No automatic triggers for complete state; manual review needed
  },
};

/**
 * Check if a state transition is valid
 * @param {string} currentState - Current OpenSpec label
 * @param {string} nextState - Desired next state
 * @returns {boolean}
 */
function isValidTransition(currentState, nextState) {
  if (!TRANSITIONS[currentState]) {
    return false;
  }
  return TRANSITIONS[currentState].includes(nextState);
}

/**
 * Get valid next states from current state
 * @param {string} currentState - Current OpenSpec label
 * @returns {array} Valid next states
 */
function getValidNextStates(currentState) {
  return TRANSITIONS[currentState] || [];
}

/**
 * Get triggers for automatic progression from a state
 * @param {string} currentState - Current OpenSpec label
 * @returns {object} Triggers and their resulting states
 */
function getProgressionTriggers(currentState) {
  return PHASE_TRIGGERS[currentState] || {};
}

/**
 * Check if transition is a progression (moving forward)
 * @param {string} currentState - Current state
 * @param {string} nextState - Next state
 * @returns {boolean}
 */
function isProgression(currentState, nextState) {
  const progressionOrder = [
    STATES.SPECIFICATION_PENDING,
    STATES.SPECIFICATION_IN_PROGRESS,
    STATES.SPECIFICATION_COMPLETE,
    STATES.IMPLEMENTATION_PENDING,
    STATES.IMPLEMENTATION_IN_PROGRESS,
    STATES.IMPLEMENTATION_COMPLETE,
  ];

  const currentIndex = progressionOrder.indexOf(currentState);
  const nextIndex = progressionOrder.indexOf(nextState);

  return nextIndex > currentIndex;
}

/**
 * Check if transition is a rollback (moving backward)
 * @param {string} currentState - Current state
 * @param {string} nextState - Next state
 * @returns {boolean}
 */
function isRollback(currentState, nextState) {
  const progressionOrder = [
    STATES.SPECIFICATION_PENDING,
    STATES.SPECIFICATION_IN_PROGRESS,
    STATES.SPECIFICATION_COMPLETE,
    STATES.IMPLEMENTATION_PENDING,
    STATES.IMPLEMENTATION_IN_PROGRESS,
    STATES.IMPLEMENTATION_COMPLETE,
  ];

  const currentIndex = progressionOrder.indexOf(currentState);
  const nextIndex = progressionOrder.indexOf(nextState);

  return nextIndex < currentIndex;
}

/**
 * Get phase name from state
 * @param {string} state - OpenSpec label
 * @returns {string} Phase name (specification or implementation)
 */
function getPhase(state) {
  if (state && state.startsWith("openspec:specification")) {
    return "specification";
  }
  if (state && state.startsWith("openspec:implementation")) {
    return "implementation";
  }
  return null;
}

/**
 * Get step within phase (pending, in-progress, complete)
 * @param {string} state - OpenSpec label
 * @returns {string} Step (pending, in-progress, or complete)
 */
function getStep(state) {
  if (state && state.includes("pending")) {
    return "pending";
  }
  if (state && state.includes("in-progress")) {
    return "in-progress";
  }
  if (state && state.includes("complete")) {
    return "complete";
  }
  return null;
}

module.exports = {
  STATES,
  TRANSITIONS,
  PHASE_TRIGGERS,
  isValidTransition,
  getValidNextStates,
  getProgressionTriggers,
  isProgression,
  isRollback,
  getPhase,
  getStep,
};
