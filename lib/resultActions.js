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
