const S3Client = require("aws-sdk/clients/s3");
const fs = require('fs');
const path = require('path');

async function getScriptFromS3(scriptName) {
	const s3 = new S3Client();
	const params = { Bucket: process.env.S3_BUCKET, Key: `${process.env.S3_SCRIPT_DIR}/${scriptName}` };
	console.log(`  >>Fetching script from AWS S3: ${params.Bucket}/${params.Key}`);
	let data;
	try {
		data = await s3.getObject(params).promise();
		
		const fileWithPath = path.join(__dirname, '..', 'scripts', scriptName);
		fs.writeFileSync(fileWithPath, data.Body); 

		console.log(`  >>Successfully saved ${scriptName}\n`);
	} catch(err) {
		console.error(err.message);
	}
	
}

async function saveScriptToS3(scriptName) {
	const s3 = new S3Client(config);
	const fileWithPath = path.join(__dirname, '..', 'scripts', scriptName);
	const fileContent = fs.readFileSync(fileWithPath);


	const params = {
		Bucket: process.env.S3_BUCKET,
		Key: `${process.env.S3_SCRIPT_DIR}/${scriptName}`,
		Body: fileContent
	};
	
	let response;
	try {
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