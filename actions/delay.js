const setDelay = require('../lib/setDelay');

const delay = async (_, {delayTimer}) => {
  await setDelay(delayTimer);
}

module.exports = delay;
