const createLoop = async (currentIndex, { next, stepIndex, times }) => {
  let loopStart = currentIndex + 1;
  let loopEnd = loopStart;
  let resumeAfterLoop = loopStart + 1;
  
  if (next && typeof next === 'number') {
    loopEnd = loopStart + next;
    resumeAfterLoop = loopEnd + 1;
  }
  
  if (stepIndex && typeof stepIndex === 'number') {
    loopStart = stepIndex;
    loopEnd = stepIndex;
  }
  
  const loop = {
      loopStart: loopStart,
      currentIndex: currentIndex,
      loopEnd: loopEnd,
      loopeExitIndex:resumeAfterLoop,
      requiredTimes: times
  }

  return loop;
}

module.exports = createLoop;
