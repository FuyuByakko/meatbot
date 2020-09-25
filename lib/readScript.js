const { getScriptFromS3 } = require('./aws');

async function getScript(scriptName, fromS3 = false) {
  let script;
	try {
		if (fromS3) {
			await getScriptFromS3(scriptName)
		}
		
		script = getLocalScript(scriptName)
		
	} catch (err) {
		return Promise.reject(new Error(err.message));
	}

	return Promise.resolve(script);
}

function getLocalScript(scriptName) {
  //TODO: sanitize input to prevent XSS??
	const script = require(`../scripts/${scriptName}`);
	return script;
}

module.exports.getScript = getScript;