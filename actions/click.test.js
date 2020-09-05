const browserInstance = require('../lib/browser');
const path = require('path');
const click = require('./click');

describe("Click Action", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await browserInstance()
  });

  afterAll(async () => {
    await browser.close();
  })

  beforeEach(async () => {
    page = await browser.newPage();
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-one.html')}`
    await page.goto(newURL);
  });

  afterEach(async () => {
    await page.close()
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
