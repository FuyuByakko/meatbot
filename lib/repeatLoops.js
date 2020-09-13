const createLoop = (currentIndex, stepIndex, { next, times, resumeFromLoopEnd }) => {
  let loopStart = currentIndex + 1;
  let loopExitIndex = currentIndex + 1;

  if (stepIndex !== 'undefined' && typeof stepIndex === 'number') {
    loopStart = stepIndex;
  }

  //Loop end is inclusive to check against current index at the end of iteration
  let loopEnd = loopStart + next - 1;
  
  if (stepIndex === undefined || resumeFromLoopEnd) {
    loopExitIndex = loopEnd + 1;
  }

  const loop = {
      loopStart: loopStart,
      loopEnd: loopEnd,
      loopExitIndex:loopExitIndex,
      requiredTimes: times
  }

  return loop;
}

module.exports = { createLoop };
