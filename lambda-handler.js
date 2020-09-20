const { createScriptRunner, endScriptRunner } = require('./lib/scriptRunner');

exports.handler = async (event, context, callback) => {
	let statusCode = 200;
	let resultObj = {};
	try {
		const { scriptInfo } = event;
		console.log(`Running ${scriptInfo.name}`);
		
		//get scrit from S3
		const scriptContents = getScriptContents(scriptInfo);
		
		const lambdaEnvironment = true;
		const scriptRunner = await createScriptRunner(lambdaEnvironment);
		
    const result = await scriptRunner(scriptContents);
    if (result && result.size && result.size() > 0) {
			console.log('\nSTORAGE CONTENT:')
      const printData = (key, value) => { console.log(`* ${key}: ${value}`)};
      result.each(printData);
    }
		
		resultObj = result.toJSObject();
  } catch (error) {
		console.error(error.message);
		resultObj.error = error;
		statusCode = 500;
		// return callback(error);
  } finally {
		try {
			await endScriptRunner();
    } catch(error) {
			resultObj.error = error;;
			statusCode = 500;
		}
  }
	//return callback(null, resultObj);
	//NEEDS to return a JSON formatted string
  return {
		statusCode: statusCode,
		body: resultObj
	}
};

function getScriptContents(script) {
	let contents = script.contents;
	if (!contents) {
		contents = getScriptFromS3(script.name);
	}
	
	return contents;
}

function getScriptFromS3(scriptName) {
	const S3Client = require("aws-sdk/clients/s3");
	const s3 = new S3Client({ region: process.env.S3_REGION });
	
	//for now return local script
	const contents = require(`./scripts/${scriptName}`);
	
	return contents;
}