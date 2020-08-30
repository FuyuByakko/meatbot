const setDelay = (delay) => new Promise(resolve => setTimeout(resolve, delay));

module.exports = setDelay;