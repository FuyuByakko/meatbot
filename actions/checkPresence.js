const {
  createActionResultJump,
  createActionResultEnd,
  ACTION_RESULT_JUMP,
  ACTION_RESULT_END
} = require('../lib/resultActions');

const checkPresence = async (page, { targetSelector, xpath, onCheckFail, stepId, invert }) => {
  let result = [];

  if (targetSelector) {
    result = await page.$$(targetSelector);
  }

  if (xpath) {
    result = await page.$x(xpath);
  }

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
