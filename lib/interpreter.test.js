const { interpreterBuilder } = require('./interpreter');
const browserInstance = require('./browser');
const path = require('path');

describe('IntepretorBuilder', () => {
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
  });

  afterEach(async () => {
    await page.close()
  });

  test('should exist as a function', () => {
    expect(interpreterBuilder).toBeDefined();
    expect(typeof interpreterBuilder).toBe('function');
  });

  test('should return a function', () => {
    const interpreter = interpreterBuilder(page);
    expect(typeof interpreter).toBe('function');
  });
  
  test('should return -1 when passed a bad action type', async () => {
    const interpreter = interpreterBuilder(page);
 
    const script = {
      actions: [
        { type: 'badScript'},
      ]
    }
    
    const errorReturn = await interpreter(script);
    expect(errorReturn).toBe(-1);
  });

  test('should be able to call an action in the scripts (GOTO)', async () => {
    const interpreter = interpreterBuilder(page);
 
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    const script = {
      actions: [
        { type: 'goto', destination: `${URL}`},
      ]
    }
  });

  test('should be able to call an action in the scripts (INPUT)', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
 
    const inputText = "hello!"
    const script = {
      actions: [
        { type: 'input', targetSelector:'input', text: inputText},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(inputText);
  });

  test('should be able to call a chain of actions in the scripts', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    const testText = 'this is a sample test text';

    const script = {
      actions: [
        { type: 'goto', destination: `${URL}`},
        { type: 'click', targetSelector: '.goto-page-two'},
        { type: 'input', targetSelector: 'input', text: testText},
      ]
    }
    
    const interpreter = interpreterBuilder(page);
    await interpreter(script);

    const newExpectedURL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-two.html')}`;
    const newActualURL = path.join(`${page.url()}`);
    expect(newActualURL).toEqual(newExpectedURL);

    const searchValue = await page.$eval('input', el => el.value);
    expect(searchValue).toEqual(testText);
  });
})
