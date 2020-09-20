const createBrowser = require('./browser');
const { interpreterBuilder } = require('./interpreter');

let browser;

async function createScriptRunner(forServerless) {
	if (!browser) {
	 	browser = await createBrowser(forServerless);
	}
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
