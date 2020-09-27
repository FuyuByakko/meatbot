const path = require('path');

const envConfigCreate = (inLambda = false) => {
	process.env.BROWSER_HEADLESS=process.env.BROWSER_HEADLESS || true

	process.env.AWS_REGION = process.env.AWS_REGION || ''
	process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || ''
	process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ''

	process.env.S3_BUCKET = process.env.S3_BUCKET || ''
	process.env.S3_SCRIPT_DIR=process.env.S3_SCRIPT_DIR || ''
	process.env.S3_MEATBOT_VERSION_DIR=process.env.S3_MEATBOT_VERSION_DIR || ''

	//set the scripts directories for lambda or local
	if (inLambda) {
		createLambdaConfig();
	} else {
		createLocalConfig();
	}
}

function createLocalConfig() {
	process.env.SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');
}
function createLambdaConfig() {
	process.env.LAMBDA_ENV = true;
	process.env.SCRIPTS_DIR = path.join('/tmp');

}
module.exports.envConfigCreate = envConfigCreate;