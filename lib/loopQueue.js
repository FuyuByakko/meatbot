class LoopQueue {
  constructor() {
    this.queue = [];
  }

  add(currentIndex, stepIndex, loopInfo) {
    const nrOfOtemsToRepeat = loopInfo.next;
    const repetitions = loopInfo.times;
    const resumeFromLoopEnd = loopInfo.resumeFromLoopEnd;

    let loopStart = currentIndex + 1;
    let loopExitIndex = currentIndex + 1;
  
    if (stepIndex !== 'undefined' && typeof stepIndex === 'number') {
      loopStart = stepIndex;
    }
  
    //Loop end is inclusive to check against current index at the end of iteration
    let loopEnd = loopStart + nrOfOtemsToRepeat - 1;
    
    if (stepIndex === undefined || resumeFromLoopEnd) {
      loopExitIndex = loopEnd + 1;
    }

    //since the loop execution will start right away, decrement required repetitions
    const loop = {
        loopStart: loopStart,
        loopEnd: loopEnd,
        loopExitIndex:loopExitIndex,
        requiredTimes: repetitions - 1
    }
    
    this.queue.push(loop)
    return loop.loopStart;
  }

  pop() {
    this.queue.pop()
  }

  size() {
    return this.queue.length
  }

  jumpOutOfLoops(nextIndex) {
    if (nextIndex === undefined) return;
    while(this.size() > 0) {
      let latestLoop = this.queue[this.size() - 1];
      if (nextIndex >= latestLoop.loopStart && nextIndex <= latestLoop.loopEnd) {
        return;
      }
      this.pop()
    }
  }

  getNextIndexFromLoop(currentIndex) {
    if (this.size() === 0) return;

    const currentLoop = this.queue[this.size() - 1];
    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentLoop.loopStart && nextIndex <= currentLoop.loopEnd) {
      return nextIndex;
    }
    if (currentLoop.requiredTimes > 0) {
      nextIndex = currentLoop.loopStart;
      currentLoop.requiredTimes -= 1;
    } else {
      nextIndex = currentLoop.loopExitIndex

      this.pop()
      //check if same Index is applicable for outer (earlier) loops
      let outerLoopNextIndex = this.getNextIndexFromLoop(nextIndex - 1);
      if (outerLoopNextIndex !== undefined) {
        nextIndex = outerLoopNextIndex;
      }
    }

    return nextIndex;
  }
}  

module.exports = LoopQueue;
