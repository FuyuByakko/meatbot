const click = async (page, targetSelector) => {
  await page.click(targetSelector);
};

module.exports = click;