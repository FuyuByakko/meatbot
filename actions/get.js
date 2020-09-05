const get = async (page, { targetSelector, xpath, keyName }, storage) => {
		let result = [];

		try {
			let elementHandles;

			if (targetSelector) {
				elementHandles = await page.$$(targetSelector);
			}

			if (xpath) {
				elementHandles = await page.$x(xpath);
			}

			result = await Promise.all(elementHandles.map(element => element.evaluate(e =>e.innerText)));
    } catch (error) {
			console.error(error.message);
		} finally {
			storage.set(keyName, result);
		}
}

module.exports = get;
