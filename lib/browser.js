const puppeteer = require('puppeteer');
let broswerInstance = null;

const createBrowser = async () => {
  const isHeadless = process.env.BROWSER_HEADLESS === "false" ? false : true;
  if (!broswerInstance) {
    broswerInstance = await puppeteer.launch({headless: isHeadless});
  }
  return broswerInstance;
}

module.exports = createBrowser;
