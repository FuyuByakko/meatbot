const { createBrowser, closeBrowser } = require('./browser');
const { interpreterBuilder } = require('./interpreter');

let browser;

async function createScriptRunner() {
	try {
		if (!browser) {
			browser = await createBrowser();
		}
		const page = await browser.newPage();
		
		return interpreterBuilder(page);
	} catch (err) {
		console.error(err.message);
	}
}

async function endScriptRunner() {
	try {
		if (browser) {
			await closeBrowser()
		}
		browser = null;
	} catch (err) {
		console.error(err.message);
	}
}

module.exports = {
	createScriptRunner,
	endScriptRunner,
}
