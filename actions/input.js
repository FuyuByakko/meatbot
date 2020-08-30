const input = async (page, {targetSelector, text}) => {
  await page.type(targetSelector, text);
};

module.exports = input;