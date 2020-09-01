const createBrowser = require('./browser');
const { interpreterBuilder } = require('./interpreter');

let browser;

async function createScriptRunner() {
	 browser = await createBrowser();
	 const page = await browser.newPage();
	 return interpreterBuilder(page);
}

async function endScriptRunner() {
	if (browser) {
		await browser.close()
	}
	browser = null;
}

module.exports = {
	createScriptRunner,
	endScriptRunner,
}
