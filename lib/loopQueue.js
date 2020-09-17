class LoopQueue {
  constructor() {
    this.queue = [];
  }

  add(currentIndex, stepIndex, { next, times, resumeFromLoopEnd }) {
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

    //since the loop execution will start right away, decrement required times
    const loop = {
        loopStart: loopStart,
        loopEnd: loopEnd,
        loopExitIndex:loopExitIndex,
        requiredTimes: times - 1
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
    for (let i = this.size() - 1; i >= 0; i--) {
      let currentLoop = this.queue[i];
      if (nextIndex >= currentLoop.loopStart && nextIndex <= currentLoop.loopEnd) {
        break;
      }
      this.pop()
    }
  }

  getNextIndexFromLoop(currentIndex) {
    if (this.size() === 0) return;

    const currentLoop = this.queue[this.size() - 1];
    let nextIndex = currentIndex + 1;
    if (nextIndex <= currentLoop.loopEnd) {
      return nextIndex;
    }
    if (currentLoop.requiredTimes > 0) {
      nextIndex = currentLoop.loopStart;
      currentLoop.requiredTimes -= 1;
    } else {
      nextIndex = currentLoop.loopExitIndex

      this.pop()
      //TODO: Add handler for NEsted Loops
      //check if next Index is applicable for outerloops
      let outerLoopNextIndex = this.getNextIndexFromLoop(nextIndex);
      if (outerLoopNextIndex !== undefined) {
        nextIndex = outerLoopNextIndex;
      }
    }

    return nextIndex;
  }
}  

module.exports = LoopQueue;
