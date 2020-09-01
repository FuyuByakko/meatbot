const browserInstance = require('../lib/browser');
const path = require('path');
const get = require('./get');

describe('GET Action', () => {
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
    const URL = `${path.join('file:', __dirname,'fixtures', 'test-page-three.html')}`
    await page.goto(URL)
  });

  afterEach(async () => {
    await page.close();
  });
  
  test('should exist', () => {
    expect(get).toBeDefined();
  });

  test('should return an empty array on an invalid selector', async () => {
    const expectedResult = []
    let result = await get(page, { targetSelector: '' });
    expect(result).toEqual(expectedResult);
    let result2 = await get(page, { targetSelector: 'invalidSelecotr' });
    expect(result2).toEqual(expectedResult);
  });

  test('should return an epty array when selector is not found', async () => {
    const expectedResult = []
    let result = await get(page, { targetSelector: 'h4' });
    expect(result).toEqual(expectedResult);
  });
  
  test('should return the value of a unique selector at index 0', async () => {
    const expectedResult = 'Take us to test page two'
    let result = await get(page, { targetSelector: '.goto-page-two' });
    expect(result[0]).toEqual(expectedResult);
  });

  test('should return an array of values on multile matches with selector', async () => {
    const expectedResult = [
      'Test Page Three',
      'Multiple Headers',
      'To Catch Them All'
    ];

    let result = await get(page, { targetSelector: 'h1' });
    expect(result).toEqual(expectedResult);
  });
});
