const browserInstance = require('../lib/browser');
const path = require('path');
const get = require('./get');

describe('GET Action', () => {
  let browser;
  let page;
  let storage;

  beforeAll(async () => {
    browser = await browserInstance()
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    const URL = `${path.join('file:', __dirname,'fixtures', 'test-page-three.html')}`;
    await page.goto(URL);
    storage = new Map();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should exist', () => {
    expect(get).toBeDefined();
  });

  test('should return an empty array on an invalid selector', async () => {
    const expectedResult = []
    const result = await get(page, { targetSelector: '', keyName: 'key1' });
    expect(result.data).toEqual(expectedResult);
    const result2 = await get(page, { targetSelector: 'invalidSelector', keyName: 'key2' });
    expect(result2.data).toEqual(expectedResult);
  });

  test('should return an empty array if an invalid xpath is given', async () => {
    const expectedResult = []
    const result = await get(page, { xpath: '//[@class="hello"]', keyName: 'key1' });
    expect(result.data).toEqual(expectedResult);
  });

  test('should return an epty array when selector is not found', async () => {
    const expectedResult = []
    const result = await get(page, { targetSelector: 'h4', keyName: 'key' });
    expect(result.data).toEqual(expectedResult);
  });

  test('should return an epty array when xpath is not found', async () => {
    const expectedResult = []
    const result = await get(page, { xpath: '//h4', keyName: 'key' });
    expect(result.data).toEqual(expectedResult);
  });

  test('should return the value of a unique selector at index 0', async () => {
    const expectedResult = 'Take us to test page two'
    const result = await get(page, { targetSelector: '.goto-page-two', keyName: 'key' });
    expect(result.data[0]).toEqual(expectedResult);
  });

  test('should return an array of values on multile matches with selector', async () => {
    const expectedResult = [
      'Test Page Three',
      'Multiple Headers',
      'To Catch Them All'
    ];

    const result = await get(page, { targetSelector: 'h1', keyName: 'key' });
    expect(result.data).toEqual(expectedResult);
  });

  test('should return an array of values on multile matches with XPath', async () => {
    const expectedResult = [
      'Test Page Three',
      'Multiple Headers',
      'To Catch Them All'
    ];

    const result = await get(page, { xpath: '//h1', keyName: 'key' }, storage);
    expect(result.data).toEqual(expectedResult);
  });
});
