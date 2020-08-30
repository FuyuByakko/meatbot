const goto = async (page, {destination, waitUntil}) => {
  await page.goto(destination, { waitUntil: waitUntil || 'domcontentloaded' });
};

module.exports = goto;