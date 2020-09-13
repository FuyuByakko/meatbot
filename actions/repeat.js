const { createActionResultRepeat } = require('../lib/resultActions');

const repeat = (_page, { next, stepId, times, resumeFromLoopEnd }) => {
	const loopInfo = {}	
	loopInfo.times = 1;

	if (times && typeof times === 'number' && times > 0) {
		loopInfo.times = times
	}
	
	loopInfo.stepId = stepId;
	loopInfo.next = next;
	
	if (!next || (next && next <= 0)) {
	loopInfo.next = 1;
	}
	
	loopInfo.resumeFromLoopEnd = false;
	if (resumeFromLoopEnd) {
		loopInfo.resumeFromLoopEnd = resumeFromLoopEnd;
	}

  return createActionResultRepeat(loopInfo);
}

module.exports = repeat;
