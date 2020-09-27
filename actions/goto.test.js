const { createBrowser: browserInstance } = require('../lib/browser');
const path = require('path');
const goto = require('./goto');

describe('GOTO Action', () => {
  let browser;
  let page;

  beforeAll(async () => {
    try {
      browser = await browserInstance()
    } catch (error) {
      throw(error)
    }
  });
  
  afterAll(async () => {
    try {
      if (browser) {
        await browser.close();
      } else {
        throw(new Error('No browser instance found'));
      }
    } catch (error) {
      throw(error)
    }
  })

  beforeEach(async () => {
    try {
      page = await browser.newPage();
    } catch (error) {
      throw(error)
    }
  });

  afterEach(async () => {
    try {
      if (page) {
        await page.close()
      } else {
        throw(new Error('No browser instance found'));
      }
    } catch (error) {
      throw(error)
    }
  });

  test('should exist', () => {
    expect(goto).toBeDefined();
  });

  test('should change the current url to destination', async () => {
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-one.html')}`
    await goto(page, { destination: newURL })
    expect(page.url()).not.toBe("about:blank");
    const newURLpath = path.join(`${page.url()}`);
    expect(newURLpath).toBe(newURL);
  });
});
