const puppeteer = require('puppeteer');
let broswerInstance = null;

const createBrowser = async () => {
  if (!broswerInstance) {
    broswerInstance = await puppeteer.launch({headless: process.env.BROWSER_HEADLESS || true});
  }
  return broswerInstance;
}

module.exports = createBrowser;
