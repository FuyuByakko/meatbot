const browserInstance = require('../lib/browser');
const path = require('path');
const goto = require('./goto');

describe('GOTO Action', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await browserInstance()
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
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
