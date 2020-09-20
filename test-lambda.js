const { handler } = require('./lambda-handler');

const testEvent = {
	scriptInfo: {
		name: 'mdn'
	}
}

async function start() {
 console.log(await handler(testEvent))   
}
start();