const { createScriptRunner, endScriptRunner } = require('./lib/scriptRunner');
const { getScript } = require('./lib/readScript');

const LAMBDA_ENV = true;

//context and callback are not required now but left if for the function def
exports.handler = async (event, context, callback) => {
	let statusCode = 200;
	let resultObj = {};
	try {
		const { name, script, save } = event;
		
		//if script was provided directly that will take presedence
		//else will try to find a loaded script in the S3
		const scriptContents = await getScriptContents(name, script);
		
		const scriptRunner = await createScriptRunner(LAMBDA_ENV);
		
    const result = await scriptRunner(scriptContents);
    if (result && result.size && result.size() > 0) {
			//TODO: Remove the printing of data??
			console.log('\nSTORAGE CONTENT:')
      const printData = (key, value) => { console.log(`* ${key}: ${value}`)};
      result.each(printData);
    }
		
		resultObj = result.toJSObject();
  } catch (error) {
		console.error(error.message);
		resultObj.error = error.message;
		resultObj.errorStack = error.stack;
		statusCode = 500;
  } finally {
		try {
			await endScriptRunner();
    } catch(error) {
			resultObj.error = error.message;
			resultObj.errorStack = error.stack;
			statusCode = 500;
		}
  }

	//NEEDS to return a JSON formatted string
  return JSON.stringify({
		statusCode: statusCode,
		body: resultObj
	})
};

async function getScriptContents(receivedName, receivedScript) {
	let contents;
	// if (receivedScript !== {}) {
	if (Object.keys(receivedScript).length !== 0) {
		contents = receivedScript;
		console.log(`Running received script.`);
	} else {
		contents = await getScript(receivedName, LAMBDA_ENV);
		console.log(`Running ${receivedName}`);
	}

	return contents
}
