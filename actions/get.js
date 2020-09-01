const get = async (page, { targetSelector }) => {
		let result = []
		try {
			result = await page.$$eval(`${targetSelector}`, elArr => {
				return elArr.map(element => element.innerText);
			});
    } catch (error) {
			console.error(error.message);
		} finally {
			return result;
		}
}

module.exports = get;
