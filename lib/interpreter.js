const setDelay = require('./setDelay');
const {
  ACTION_RESULT_JUMP,
  ACTION_RESULT_END,
  ACTION_RESULT_SAVE,
  ACTION_RESULT_REPEAT
} = require('../lib/resultActions');
const LoopQueue = require('./loopQueue');
const Storage = require('./storage');


module.exports.interpreterBuilder = function (page) {
  return async function(script) {
    const delay = script.actionDelay || 0;
    const storage = new Storage();
    let loopQueue = new LoopQueue();
    
    console.log(`Setting action delay to ${delay}ms`);
    
    let currentStepIndex = 0;
    while (currentStepIndex < script.actions.length) {
      let nextStepIndex;

      const action = script.actions[currentStepIndex];
      try {
        let actionFn = requireAction(action.type);
        console.log(`\nRunning action '${action.type.toUpperCase()}' with parameters:\n${parseActionContent(action)}`);
        
        const actionResult = await actionFn(page, action, storage);
        if (!actionResult) {
          nextStepIndex = loopQueue.getNextIndexFromLoop(currentStepIndex);
          currentStepIndex = updateStepIndex(currentStepIndex, nextStepIndex);
          await setDelay(delay);
          continue;
        }

        switch(actionResult.result) {
          case ACTION_RESULT_END:
            console.log(` ** Script terminated abruptly on current action!`);
            printDescription(action)
            let result = 'Script terminated with check_presence. No description available';
            if (hasDescription(action)) {
              result = action.description;
            }
            storage.add('END_ERROR', result)
            return storage;
            
          case ACTION_RESULT_SAVE:
            printDescription(action)
            console.log(` ** Saving target of get to storage with key ${action.keyName}`);
            storage.add(action.keyName, actionResult.data, action.overwrite );
            break;

          case ACTION_RESULT_JUMP:
            printDescription(action);
            console.log(` ** Jump to step ${actionResult.stepId} requested.`);
            nextStepIndex = findStepIndex(actionResult.stepId, script.actions);
            //UPDATE LOOPS for jumps
            loopQueue.jumpOutOfLoops(nextStepIndex);
            break;
            
          case ACTION_RESULT_REPEAT:
            printDescription(action);
            console.log(` ** REPEAT actions requested. Creating Loop.`);
            
            const requestedStepId = actionResult.loopInfo.stepId;
            let requestedStepIndex;
            if (requestedStepId) {
              requestedStepIndex = findStepIndex(requestedStepId, script.actions);
            }
            
            nextStepIndex = loopQueue.add(currentStepIndex, requestedStepIndex, actionResult.loopInfo);
            break;
              
          default:
            throw new Error('Invalid ACTION_RESULT. Terminating Script')
        }

         // if no valid jump target or loopStart, find NEXT Index inside a valid loop
        if (nextStepIndex === undefined) {
          //NextStepIndex stays undefined if no loops are present;
           nextStepIndex = loopQueue.getNextIndexFromLoop(currentStepIndex);
        }

        currentStepIndex = updateStepIndex(currentStepIndex, nextStepIndex)
        await setDelay(delay);
      } catch (error) {
        console.log('ERROR IN INTERPRETER')
        throw error;
      }

    }

    console.log('\nScript finished.');

    return storage;
  }
}

function requireAction(name) {
  const actionFn = require(`../actions/${name}`);
  return actionFn
}


function findStepIndex(stepId, actions) {
  const nextStepIndex = actions.findIndex( action => action.id && action.id === stepId);
  if (nextStepIndex === -1) {
    throw new Error('Invalid stepId provided. Please check stepIds')
  }
  return nextStepIndex
}

function updateStepIndex(currentStepIndex, nextStepIndex) {
  if (!nextStepIndex) {
    nextStepIndex = currentStepIndex + 1;
  }
  return nextStepIndex;
}

function printDescription(action) {
  if(hasDescription(action)) {
    console.log('\n Description:', action.description);
  }
}

function hasDescription(action) {
  return action && action.description
}

function parseActionContent(action) {
  const resultTextArr = [];
  for (const [key, value] of Object.entries(action)) {
    let formattedLine = `   >> ${JSON.stringify(key)} : ${JSON.stringify(value)}`;
    resultTextArr.push(formattedLine)
  };
  return resultTextArr.join('\n')
}
