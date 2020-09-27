const { createBrowser: browserInstance } = require('../lib/browser');
const input = require('./input');
const path = require('path');

describe("Input Action", () => {
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
      await page.goto(newURL)
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
    expect(input).toBeDefined();
  });

  test("should update input field with text", async () => {
    const inputText = 'hellow, world'
    await input(page, { targetSelector: 'input', text: inputText });
    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(inputText);
  });

  test("should update input field with text (xpath selector)", async () => {
    const inputText = 'hellow, world'
    await input(page, { xpath: '//input', text: inputText });
    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(inputText);
  });

  test("should update input field with a special character (Space)", async () => {
    const inputText = 'hellow, world'
    await input(page, { xpath: '//input', text: inputText, specialKey: 'Space' });
    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(inputText + ' ');
  });
})