const input = require('./input');
const path = require('path');
const browserInstance = require('../lib/browser');

describe("Input Action", () => {
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
    const newURL = `${path.join('file:', __dirname,'fixtures', 'test-page-one.html')}`
    await page.goto(newURL)
  });

  afterEach(async () => {
    await page.close()
  });

  test("should exist", () => {
    expect(input).toBeDefined();
  });

  test("should update input field with text", async () => {
    const inputText = 'hellow, world'
    await input(page, { targetSelector: 'input', text: inputText });
    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(inputText);
  });
})