const click = async (page, {targetSelector, xpath, waitForNavigation = false}) => {
  let clickTarget;
  if (targetSelector) {
    clickTarget = page.click(targetSelector);
  }
  if (xpath) {
    const handleElement = await page.$x(xpath)
    clickTarget = handleElement[0].click()
  }
  const tasks = [clickTarget];

  if (waitForNavigation) {
    tasks.push(page.waitForNavigation());
  }

  await Promise.all(tasks);
};

module.exports = click;
