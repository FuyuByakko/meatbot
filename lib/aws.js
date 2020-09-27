const S3Client = require("aws-sdk/clients/s3");
const fs = require('fs');
const path = require('path');

async function getScriptFromS3(scriptName) {
	const s3 = new S3Client();
	const params = {
		Bucket: process.env.S3_BUCKET,
		Key: `${process.env.S3_SCRIPT_DIR}/${scriptName}`
	};
	console.log(`  >>Fetching script from AWS S3: ${params.Bucket}/${params.Key}`);
	
	let data;
	try {
		data = await s3.getObject(params).promise();
		
		const fileLocation = process.env.SCRIPTS_DIR;
		const fileWithPath = path.join(fileLocation, scriptName);
		fs.writeFileSync(fileWithPath, data.Body); 

		console.log(`  >>Successfully saved ${scriptName} at ${fileLocation}\n`);
	} catch(err) {
		console.error(err.message);
	}
	
}

async function saveScriptToS3(scriptName, content) {
	//assuming 1 letter for name and min 2 for extension, min is 4 ('a.js') 
	const minNameLength = 4;

	if (!scriptName || typeof scriptName !== 'string' || scriptName.length <= minNameLength ){
		throw new Error('Check the provided script Name');
	}

	const s3 = new S3Client();
	let response;
	let params;
	let fileContent;

	try {
		if(!content) {
			const fileLocation = process.env.SCRIPTS_DIR;
			const fileWithPath = path.join(fileLocation, scriptName);
			fileContent = fs.readFileSync(fileWithPath);
		} else {
			fileContent = new Buffer.from(JSON.stringify(content));
		}

		params = {
			Bucket: process.env.S3_BUCKET,
			Key: `${process.env.S3_SCRIPT_DIR}/${scriptName}`,
			Body: fileContent
		};

		response = await s3.upload(params).promise()
	} catch (err) {
		console.error(err.message);
		throw err;
	}
	console.log(`File uploaded successfully to ${params.Bucket}/${params.Key}`);
	console.log(`Fullpath: ${response.Location}`);
	return;
}

module.exports.getScriptFromS3 = getScriptFromS3;
module.exports.saveScriptToS3 = saveScriptToS3;