const { createActionResultSave } = require('../lib/resultActions');

const get = async (page, { targetSelector, xpath }) => {
		let result = [];

		try {
			let elementHandles;

			if (targetSelector) {
				elementHandles = await page.$$(targetSelector);
			}

			if (xpath) {
				elementHandles = await page.$x(xpath);
			}
			if (elementHandles) {
				result = await Promise.all(elementHandles.map(element => element.evaluate(e =>e.innerText)));
			}
    } catch (error) {
			console.error(error.message);
		} finally {
			return createActionResultSave(result);
		}
}

module.exports = get;
