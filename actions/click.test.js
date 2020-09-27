const { createBrowser: browserInstance } = require('../lib/browser');
const path = require('path');
const click = require('./click');

describe("Click Action", () => {
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
      const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-one.html')}`
      await page.goto(newURL);
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

  test("should exist", () => {
    expect(click).toBeDefined();
  });

  test("should click on a link that navigates to test page two", async () => {
    await click(page, { targetSelector: 'a.goto-page-two', waitForNavigation: true });
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-two.html')}`
    const newURLpath = path.join(`${page.url()}`);
    expect(newURLpath).toEqual(newURL);
  });

  test("should click on a link that navigates to test page two (xpath)", async () => {
    await click(page, { xpath: '//a[@class="goto-page-two"]', waitForNavigation: true });
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-two.html')}`
    const newURLpath = path.join(`${page.url()}`);
    expect(newURLpath).toEqual(newURL);
  });
})
