const setDelay = require('./setDelay');

module.exports.interpreterBuilder = function (page) {
  return async function(script) {
    const delay = script.actionDelay || 0;

    console.log(`Setting action delay to ${delay}ms`);

    for (let action of script.actions) {
      const actionFn = require(`../actions/${action.type}`);

      console.log(`Running action ${action.type} with parameters ${JSON.stringify(action)}`);

      try {
        await actionFn(page, action);
      } catch (error) {
        console.error(error);
        await browser.close();
        return;
      }

      await setDelay(delay);
    }
    console.log('Script finished.');
  }
}