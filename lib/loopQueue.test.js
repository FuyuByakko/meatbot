const LoopQueue = require('./loopQueue');

describe('LOOP QUEUE handler', () => {
  let loopQueue;

  beforeEach(() => {
    loopQueue = new LoopQueue();
  })

  test('should create an instance of a loopQueue', () => {
    expect(loopQueue).toBeDefined();
    expect(loopQueue).toBeInstanceOf(LoopQueue);
  });

  test('should instantiate with queue param set as empty array', () => {
    expect(loopQueue.queue).toEqual([]);
  });
  describe('ADD method', () => {
    test('should exist', () => {
      expect(loopQueue.add).toBeDefined();
      expect(typeof loopQueue.add).toBe('function');
    });
  
    test('should create a loop and return the starting point (if no required Step is given)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      let requiredStepIndex;
      const expectedStart = currentIndex + 1;
      expect(loopQueue.add(currentIndex, requiredStepIndex, loopInfo)).toEqual(expectedStart);
    });
  
    test('should create a loop and return the starting point (if required Step Index is given)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const expectedStart = requiredStepIndex;
      expect(loopQueue.add(currentIndex, requiredStepIndex, loopInfo)).toEqual(expectedStart);
    });
  
    test('should create a loop with set loopEnd (no stepIndex)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      let requiredStepIndex;
      const expectedEnd = currentIndex + loopInfo.next;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedLoopEnd = loopQueue.queue[0]['loopEnd'];
      expect(receivedLoopEnd).toEqual(expectedEnd);
    });
  
    test('should create a loop with set loopEnd (stepIndex given)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const expectedEnd = requiredStepIndex + loopInfo.next - 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedLoopEnd = loopQueue.queue[0]['loopEnd'];
      expect(receivedLoopEnd).toEqual(expectedEnd);
    });
  
    test('should create a loop with correct loopExitIndex (no stepIndex)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      let requiredStepIndex;
      const expectedExit = currentIndex + loopInfo.next + 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedLoopExitIndex = loopQueue.queue[0]['loopExitIndex'];
      expect(receivedLoopExitIndex).toEqual(expectedExit);
    });
  
    test('should create a loop with correct loopExitIndex (with stepIndex)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const expectedExit = currentIndex + 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedLoopExitIndex = loopQueue.queue[0]['loopExitIndex'];
      expect(receivedLoopExitIndex).toEqual(expectedExit);
    });
  
    test('should create a loop with correct loopExitIndex (with stepIndex and resumeFromLoopEnd==true)', () => {
      const loopInfo = {
        next: 3,
        times: 3,
        resumeFromLoopEnd: true
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const expectedExit = requiredStepIndex + loopInfo.next;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedLoopExitIndex = loopQueue.queue[0]['loopExitIndex'];
      expect(receivedLoopExitIndex).toEqual(expectedExit);
    });
  
    test('should create a loop with requiredTimes param (decremented by 1 as loop execution starts immediately))', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const expectedTimes = loopInfo.times - 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      let receivedTimes = loopQueue.queue[0]['requiredTimes'];
      expect(receivedTimes).toEqual(expectedTimes);
    });
  })

  describe('SIZE method', () => {
    test('should exist', () => {
      expect(loopQueue.size).toBeDefined();
      expect(typeof loopQueue.size).toBe('function');
    });

    test('should return the 0 when no loops are present', () => {
      expect(loopQueue.size()).toBe(0);
    });
    
    test('should return the number of loops in the queue', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;

      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      expect(loopQueue.size()).toBe(1);
      
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      expect(loopQueue.size()).toBe(2);
    });
  })
  
  describe('POP method', () => {
    test('should exist', () => {
      expect(loopQueue.pop).toBeDefined();
      expect(typeof loopQueue.pop).toBe('function');
    });
    
    test('should not change anything if queue is empty', () => {
      expect(loopQueue.size()).toBe(0);
      loopQueue.pop()
      expect(loopQueue.size()).toBe(0);
    });

    test('should remove the newest (latest) loops from the queue', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
  
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      expect(loopQueue.size()).toBe(2);
      loopQueue.pop()
      expect(loopQueue.size()).toBe(1);
    });
  })
  
  describe('JumpOutOfLoop method', () => {
    test('should exist', () => {
      expect(loopQueue.jumpOutOfLoops).toBeDefined();
      expect(typeof loopQueue.jumpOutOfLoops).toBe('function');
    });
    
    test('should break out of a loop if given target index is outside of loop bounds', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const jumpTargetIndex = 9;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.jumpOutOfLoops(jumpTargetIndex);
      expect(loopQueue.size()).toBe(0);
    });

    test('should break out of multiple loops if given target index is outside of loop bounds', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const jumpTargetIndex = 9;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      expect(loopQueue.size()).toBe(3);
      loopQueue.jumpOutOfLoops(jumpTargetIndex);
      expect(loopQueue.size()).toBe(0);
    });

    test('should not change queue if jump is within loop bounds', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const jumpTargetIndex = requiredStepIndex + 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      expect(loopQueue.size()).toBe(3);
      loopQueue.jumpOutOfLoops(jumpTargetIndex);
      expect(loopQueue.size()).toBe(3);
    });

    test('should not change queue if jump is within bounds of the newest/latest loop', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const requiredStepIndex2 = 9;
      const jumpTargetIndex = requiredStepIndex2 + 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex2, loopInfo)
      expect(loopQueue.size()).toBe(3);
      loopQueue.jumpOutOfLoops(jumpTargetIndex);
      expect(loopQueue.size()).toBe(3);
    });

    test('should stop breaking out of loops when target jump index is again within bounds of a loop', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const currentIndex = 1;
      const requiredStepIndex = 3;
      const requiredStepIndex2 = 9;
      const jumpTargetIndex = requiredStepIndex + 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      loopQueue.add(currentIndex, requiredStepIndex2, loopInfo)
      expect(loopQueue.size()).toBe(3);
      loopQueue.jumpOutOfLoops(jumpTargetIndex);
      expect(loopQueue.size()).toBe(2);
    });
  })

  describe('getNextIndexFromLoop method', () => {
    test('should exist', () => {
      expect(loopQueue.getNextIndexFromLoop).toBeDefined();
      expect(typeof loopQueue.getNextIndexFromLoop).toBe('function');
    });

    test('should return undefined if loop queue is empty', () => {
      const currentIndex = 2;
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedNextIndex).not.toBeDefined()
    })

    test('should return next index (5) if it is within current iteration bounds', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const requiredStepIndex = 3;
      const currentIndex = 4;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      
      const expectedNextIndex = currentIndex + 1;
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedNextIndex).toEqual(expectedNextIndex);
    })

    test('should not change repetiotion amount if next index is in the same iteration', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const requiredStepIndex = 3;
      const currentIndex = 4;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)

      const expectedRepetiotionLeft = loopInfo.times - 1;
      loopQueue.getNextIndexFromLoop(currentIndex);
      const actualRepetiotionsLeft = loopQueue.queue[0].requiredTimes;
      
      expect(actualRepetiotionsLeft).toEqual(expectedRepetiotionLeft);
    })

    test('should decrement repetition amount and reset next Index to loop start if current iteration is over', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const requiredStepIndex = 3;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)

      const expectedNextIndex = requiredStepIndex;
      const expectedRepetiotionLeft = loopInfo.times - 2;

      currentIndex = requiredStepIndex + loopInfo.next;
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedNextIndex).toEqual(expectedNextIndex);

      const actualRepetiotionsLeft = loopQueue.queue[0].requiredTimes;
      expect(actualRepetiotionsLeft).toEqual(expectedRepetiotionLeft);
    })

    test('should return loopExitIndex if repetition amount is 0 and iteration ends', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const requiredStepIndex = 3;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)

      const expectedExitIndex = currentIndex + 1;
      const expectedRepetiotionLeft = loopInfo.times - 2;

      currentIndex = requiredStepIndex + loopInfo.next;
      // calling the method with an out of bounds index, simulates looping over all elements and resetting the index
      loopQueue.getNextIndexFromLoop(currentIndex);
      loopQueue.getNextIndexFromLoop(currentIndex);
      //the third time should return the exitIndex
      const receivedExitIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedExitIndex).toEqual(expectedExitIndex);

      expect(loopQueue.size()).toEqual(0);
    })
    
    test('should remove loop from queue after repetitions finish', () => {
      const loopInfo = {
        next: 3,
        times: 3,
      }
      const requiredStepIndex = 3;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, loopInfo)
      
      currentIndex = requiredStepIndex + loopInfo.next;
      // calling the method with an out of bounds index, simulates looping over all elements and resetting the index
      loopQueue.getNextIndexFromLoop(currentIndex);
      loopQueue.getNextIndexFromLoop(currentIndex);
      loopQueue.getNextIndexFromLoop(currentIndex);
      expect(loopQueue.size()).toEqual(0);
    })

    test('should return to previous loop if nested loop finished', () => {
      const outerLoopInfo = {
        next: 15,
        times: 3,
      }
      const nestedLoopInfo = {
        next: 3,
        times: 3,
        resumeFromLoopEnd: true
      }
      const requiredStepIndex = 3;
      const requiredStepIndex2 = 5;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, outerLoopInfo)
      loopQueue.add(currentIndex, requiredStepIndex2, nestedLoopInfo)
  
      const expectedNextIndex = requiredStepIndex2 + nestedLoopInfo.next;
  
      currentIndex = requiredStepIndex2 + nestedLoopInfo.next;
      loopQueue.getNextIndexFromLoop(currentIndex);
      loopQueue.getNextIndexFromLoop(currentIndex);
      //the third time should return the exitIndex of the nestedLoop which is within the outerLoop.
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedNextIndex).toEqual(expectedNextIndex);
  
      expect(loopQueue.size()).toEqual(1);
    })

    test('should return to previous loop if nested loop finished, and update it if outer iteration ended too', () => {
      const outerLoopInfo = {
        next: 4,
        times: 3,
      }
      const nestedLoopInfo = {
        next: 3,
        times: 3,
        resumeFromLoopEnd: true
      }
      const requiredStepIndex = 3;
      const requiredStepIndex2 = 5;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, outerLoopInfo)
      loopQueue.add(currentIndex, requiredStepIndex2, nestedLoopInfo)
  
      const expectedNextIndex = requiredStepIndex;
  
      currentIndex = requiredStepIndex2 + nestedLoopInfo.next;
      loopQueue.getNextIndexFromLoop(currentIndex);
      loopQueue.getNextIndexFromLoop(currentIndex);
      //the third time should return the exitIndex of the nestedLoop which is within the outerLoop.
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex);
      expect(receivedNextIndex).toEqual(expectedNextIndex);
  
      expect(loopQueue.size()).toEqual(1);

      const expectedRepetiotionLeft = outerLoopInfo.times - 2; 
      const actualRepetiotionsLeft = loopQueue.queue[0].requiredTimes;
      expect(actualRepetiotionsLeft).toEqual(expectedRepetiotionLeft);
    })

    test('should remove loops from queue if iterations finished', () => {
      const outerLoopInfo = {
        next: 4,
        times: 3,
      }
      const nestedLoopInfo = {
        next: 3,
        times: 3,
        resumeFromLoopEnd: true
      }
      const requiredStepIndex = 3;
      const requiredStepIndex2 = 5;
      let currentIndex = 1;
      loopQueue.add(currentIndex, requiredStepIndex, outerLoopInfo)
      loopQueue.add(currentIndex, requiredStepIndex2, nestedLoopInfo)
  
      const expectedNextIndex = currentIndex + 1;
  
      currentIndex = requiredStepIndex2 + nestedLoopInfo.next;
      //exit nested loop
      loopQueue.getNextIndexFromLoop(currentIndex); //nested 1 iter
      loopQueue.getNextIndexFromLoop(currentIndex); //nested 2nd iter
      loopQueue.getNextIndexFromLoop(currentIndex); //3rd iteration of nested loop returns nextIndex 7
      //this completes 1st iteration of the outer loop
      loopQueue.getNextIndexFromLoop(currentIndex); //2nd iter outer loop
      const receivedNextIndex = loopQueue.getNextIndexFromLoop(currentIndex); //3rd iter outer loop, exit with exitIndex
      expect(receivedNextIndex).toEqual(expectedNextIndex);
  
      expect(loopQueue.size()).toEqual(0);
    })
  })
})

