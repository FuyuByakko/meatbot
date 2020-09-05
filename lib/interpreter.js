const setDelay = require('./setDelay');
const {
  ACTION_RESULT_JUMP,
  ACTION_RESULT_END
} = require('../lib/resultActions');


module.exports.interpreterBuilder = function (page) {
  return async function(script) {
    const delay = script.actionDelay || 0;
    const storage = new Map();
    
    console.log(`Setting action delay to ${delay}ms`);
    
    let currentStepIndex = 0;
    while (currentStepIndex < script.actions.length) {
      const action = script.actions[currentStepIndex];
      try {
        let actionFn = requireAction(action.type);
        console.log(`Running action ${action.type} with parameters ${JSON.stringify(action)}`);
        
        const actionResult = await actionFn(page, action, storage);
        if (!actionResult) {
          currentStepIndex++;
          await setDelay(delay);
          continue;
        }
        switch(actionResult.result) {
          case ACTION_RESULT_END:
            console.log(`Script terminated abruptly on current action!`);
            printDescription(action)
            return storage;
            
          case ACTION_RESULT_JUMP:
            printDescription(action);
            console.log(`Jump to step ${actionResult.stepId} requested.`);
            const stepIndex = findStepIndex(actionResult.stepId, script.actions);
            if (stepIndex === -1) {
              throw new Error('Invalid stepId provided. Please check stepIds')
            }
            currentStepIndex = stepIndex;
            await setDelay(delay);
            continue;
          
          default:
            throw new Error('Invalid ACTION_RESULT. Terminating Script')
        }
      } catch (error) {
        console.error(error.message);
        return -1;
      }

    }

    console.log('Script finished.');

    return storage;
  }
}

function requireAction(name) {
  const actionFn = require(`../actions/${name}`);
  return actionFn
}


function findStepIndex(stepId, actions) {
  return actions.findIndex( action => action.id && action.id === stepId);
}

function printDescription(action) {
  if(hasDescription(action)) {
    console.log(action.description);
  }
}

function hasDescription(action) {
  return action && action.desciption
}