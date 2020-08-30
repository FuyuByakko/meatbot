const goto = async (page, destination) => {
  await page.goto(destination);
};

module.exports = goto;