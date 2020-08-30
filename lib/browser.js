const puppeteer = require('puppeteer');
let broswerInstance = null;

const createBrowser = async () => {
  if (!broswerInstance) {
    //TODO make headless based on .env
    broswerInstance = await puppeteer.launch({headless: false});
  }
  return broswerInstance;
}

module.exports = createBrowser;
