const { createActionResultRepeat } = require('../lib/resultActions');

const repeat = (_page, { next, stepId, times }) => {
	const loopInfo = {}	
	loopInfo.times = 1;

	if (times && typeof times === 'number' && times > 0) {
		loopInfo.times = times
	}
	
	if (stepId) {
		loopInfo.stepId = stepId;
  } else if (!next || (next && next <= 0)) {
		loopInfo.next = 1;
	} else {
		loopInfo.next = next;
	}

  return createActionResultRepeat(loopInfo);
}

module.exports = repeat;
