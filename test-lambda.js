const dotenv = require('dotenv');
dotenv.config();
const { handler } = require('./lambda-handler');

const testEvent = {
	name: 'mdn.js',
	script: {},
	save:false
}

const testEvent2 = {
	name: "",
	script: {
		"actions": [
  	  { "id": "start", "type": "goto", "destination": "https://developer.mozilla.org/en-US/"},
  	  { "type": "input", "targetSelector": ".search-input-field", "text": "String split", "specialKey": "Enter", "waitForNavigation": true}
		]
	},
	save: false
}


async function start() {
 console.log(await handler(testEvent))   
}
start();