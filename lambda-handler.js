const { createScriptRunner, endScriptRunner } = require('./lib/scriptRunner');
const { envConfigCreate }  = require('./lib/envConfigGenerator')
const { getScript } = require('./lib/readScript');
const { saveScriptToS3 } = require('./lib/aws');

const inLambda = true;
envConfigCreate(inLambda);

//context and callback are not required now but left if for the function def
exports.handler = async (event, context, callback) => {
	let statusCode = 200;
	let resultObj = {};
	try {
		const { name, script, save } = event;
		
		//if script was provided directly that will take presedence
		//else will try to find a loaded script in the S3
		const scriptContents = await getScriptContents(name, script);
		
		const scriptRunner = await createScriptRunner();
		
		const result = await scriptRunner(scriptContents);
		
		//with save flag, if script succeeds and has a name, save given script to S3
		if(save) {
			console.log('Saving received script to S3')
			await saveScriptToS3(name, script);
		}

    if (result && result.size && result.size() > 0) {
			//TODO: Remove the printing of data??
			console.log('\nSTORAGE CONTENT:')
      const printData = (key, value) => { console.log(`* ${key}: ${value}`)};
      result.each(printData);
			resultObj = result.toJSObject();
    } else {
			resultObj['Empty Body'] = "Script did not save any data."
		}
		
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

  return {
	  statusCode: statusCode,
		body: resultObj
	}
};

async function getScriptContents(receivedName, receivedScript) {
	let contents;
	if (Object.keys(receivedScript).length !== 0) {
		contents = receivedScript;
		console.log(`Running received script.`);
	} else {
		//get file from S3 in case of lambda
		const fromS3 = true;
		contents = await getScript(receivedName, fromS3);
		console.log(`Running ${receivedName}`);
	}

	return contents
}
