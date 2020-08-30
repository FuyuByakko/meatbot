const click = async (page, {targetSelector, waitForNavigation = false}) => {
  const tasks = [page.click(targetSelector)];

  if (waitForNavigation) {
    tasks.push(page.waitForNavigation());
  }

  await Promise.all(tasks);
};

module.exports = click;