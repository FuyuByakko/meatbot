const setDelay = require('./setDelay');

const ACTION_RESULT_JUMP = 'jump';
const ACTION_RESULT_END = 'end';

module.exports.ACTION_RESULT_JUMP = ACTION_RESULT_JUMP;
module.exports.ACTION_RESULT_END = ACTION_RESULT_END;

module.exports.createActionResultJump = (id) => ({
  result: ACTION_RESULT_JUMP,
  stepId: id
});

module.exports.createActionResultEnd = () => ({
  result: ACTION_RESULT_END
});

module.exports.interpreterBuilder = function (page) {
  return async function(script) {
    const delay = script.actionDelay || 0;

    console.log(`Setting action delay to ${delay}ms`);

    let currentStepIndex = 0;
    while (currentStepIndex < script.actions.length) {
      const action = script.actions[currentStepIndex];
      try {
        const actionFn = require(`../actions/${action.type}`);

        console.log(`Running action ${action.type} with parameters ${JSON.stringify(action)}`);

        const actionResult = await actionFn(page, action);
        if (actionResult) {
          switch(actionResult.result) {
            case ACTION_RESULT_END:
              console.log(`Script terminated on current action!`);
              return;
            case ACTION_RESULT_JUMP:
              console.log(`Jumping to step ${actionResult.stepId}`);
              const stepIndex = findStepIndex(actionResult.stepId, script.actions);
              if (stepIndex === -1) {
                throw new Error('Invalid stepId provided. Please check stepIds')
              }
              currentStepIndex = stepIndex - 1;
          }
        }
      } catch (error) {
        console.error(error.message);
        return -1;
      }

      currentStepIndex++;
      await setDelay(delay);
    }
    console.log('Script finished.');
  }
}

function findStepIndex(stepId, actions) {
  return actions.findIndex( action => action.id && action.id === stepId);
}
