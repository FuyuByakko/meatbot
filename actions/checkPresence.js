const {
  createActionResultJump,
  createActionResultEnd,
  ACTION_RESULT_JUMP,
  ACTION_RESULT_END
} = require('../lib/interpreter');

const checkPresence = async (page, { targetSelector, onCheckFail, stepId, invert }) => {
  const result = await page.$$(targetSelector);
  if ((result.length === 0 && !invert) || (result.length > 0 && invert)) {
    switch (onCheckFail) {
      case ACTION_RESULT_JUMP:
        return createActionResultJump(stepId);
      case ACTION_RESULT_END:
        return createActionResultEnd();
    }
  }
}

module.exports = checkPresence;
