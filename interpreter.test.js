const interpreter = require('./interpreter');
const browserInstance = require('../lib/browser');
const path = require('path');

const actions = [
  { type: 'goto', destination: ''},
  { type: 'click', targetSelector: ''},
  { type: 'input', targetSelector: '', text: ''},
]

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
    await click(page, { targetSelector: 'a.goto-page-two' });
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-two.html')}`
    const newURLpath = path.join(`${page.url()}`);
    expect(newURLpath).toBe(newURL);
  });
})