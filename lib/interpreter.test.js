const { interpreterBuilder } = require('./interpreter');
const browserInstance = require('./browser');
const path = require('path');
const Storage = require('./storage');

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
  
  test('should return an instance of Storage if no errors occur', async () => {
    const interpreter = interpreterBuilder(page);
    
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    const script = {
      actions: []
    }
    const result = await interpreter(script);
    expect(result).toBeInstanceOf(Storage);
    expect(result.size()).toBe(0);
  });
  
  test('should be able to call an action in the scripts (GOTO)', async () => {
    const interpreter = interpreterBuilder(page);
    
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    const script = {
      actions: [
        { type: 'goto', destination: `${URL}`},
      ]
    }
    await interpreter(script);
    const newExpectedURL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`;
    const newActualURL = path.join(`${page.url()}`);
    expect(newActualURL).toEqual(newExpectedURL);
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
  
  test('should return a map with test key and value when GET action is called', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-two.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const expectedValue = ['Test Page Two'];
    const expectedKey = 'test_key'
    const script = {
      actions: [
        { type: 'get', targetSelector:'h1', keyName: 'test_key'},
      ]
    }
    const result = await interpreter(script);
    expect(result.size()).toBe(1);
    for (const [receivedKey, receivedValue] of result.entries()) {
      expect(receivedKey).toEqual(expectedKey);
      expect(receivedValue).toEqual(expectedValue);
    }
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
 
  test('should repeat next action if repeat command is given', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 3;
    const inputText = "hello!"
    const script = {
      actions: [
        { type: 'repeat', times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.repeat(repeatTimes);
    expect(searchValue).toEqual(expectedText);
  });
 
  test('should repeat next 4 commands given in the list', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const inputText = "abcd"
    const script = {
      actions: [
        { type: 'repeat', next: 4, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.repeat(repeatTimes);
    expect(searchValue).toEqual(expectedText);
  });
 
  test('should repeat next N commands and resume from N+1 if no ID provided', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const repeatedActions = 2;
    const inputText = "abcd"
    const script = {
      actions: [
        { type: 'repeat', next: repeatedActions, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.slice(0, repeatedActions).repeat(repeatTimes) + inputText.slice(repeatedActions);
    expect(searchValue).toEqual(expectedText);
  });
  
  test('should repeat N commands from ID and resume from n+1 with ID and resumeFromLoopEnd', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const repeatedActions = 2;
    const inputText = "abcd"
    const script = {
      actions: [
        { type: 'repeat', stepId: 'letter_b', next: repeatedActions, times: repeatTimes, resumeFromLoopEnd: true },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { id: 'letter_b', type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.slice(1, 1+ repeatedActions).repeat(repeatTimes) + inputText.slice(1 + repeatedActions);
    expect(searchValue).toEqual(expectedText);
  });
  
  test('should repeat N commands from ID and resume from next command if resumeFromLoopEnd==false', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const repeatedActions = 2;
    const inputText = "abcd"
    const script = {
      actions: [
        { type: 'repeat', stepId: 'letter_b', next: repeatedActions, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { id: 'letter_b', type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.slice(1, 1+ repeatedActions).repeat(repeatTimes) + inputText;
    expect(searchValue).toEqual(expectedText);
  });

  test('should be able to nest loops ', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const inputText = "a"
    const inputText2 = "b"
    const inputText3 = "c"
    const script = {
      actions: [
        { type: 'repeat', next:4, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText},
        { type: 'repeat', next:2, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText2},
        { type: 'input', targetSelector:'input', text: inputText2},
        { type: 'input', targetSelector:'input', text: inputText3},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    const innerRepeat = (inputText2 + inputText2).repeat(repeatTimes)
    const expectedText = (inputText + innerRepeat).repeat(repeatTimes) + inputText3;
    expect(searchValue).toEqual(expectedText);
  });

  test('should break out of loop if JUMP action result is outside of loop', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const inputText = "abcde"
    const script = {
      actions: [
        { type: 'repeat', next:4, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'checkPresence', xpath:'//input[@class="cool_input"]', onCheckFail: 'jump', stepId: 'letter_e'},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
        { id: 'letter_e',type: 'input', targetSelector:'input', text: inputText[4]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.slice(0, 2) + inputText.slice(4);
    expect(searchValue).toEqual(expectedText);
  });

  test('should stay in second loop if JUMP action result is within bounds', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const inputText = "abcde"
    const script = {
      actions: [
        { type: 'repeat', next:6, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { type: 'repeat', next:3, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'checkPresence', xpath:'//input[@class="cool_input"]', onCheckFail: 'jump', stepId: 'letter_d'},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { id: 'letter_d',type: 'input', targetSelector:'input', text: inputText[3]},
        { type: 'input', targetSelector:'input', text: inputText[4]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = (inputText.slice(0, 2) + inputText[3]).repeat(2) + inputText[4];
    expect(searchValue).toEqual(expectedText);
  });

  test('should break out of multiple loop if JUMP action result is outside of both loops', async () => {
    const URL = `${path.join('file:', __dirname, '..', 'actions', 'fixtures', 'test-page-one.html')}`
    await page.goto(URL)
    const interpreter = interpreterBuilder(page);
    
    const repeatTimes = 2;
    const inputText = "abcde"
    const script = {
      actions: [
        { type: 'repeat', next:4, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[0]},
        { type: 'repeat', next:2, times: repeatTimes },
        { type: 'input', targetSelector:'input', text: inputText[1]},
        { type: 'checkPresence', xpath:'//input[@class="cool_input"]', onCheckFail: 'jump', stepId: 'letter_e'},
        { type: 'input', targetSelector:'input', text: inputText[2]},
        { type: 'input', targetSelector:'input', text: inputText[3]},
        { id: 'letter_e',type: 'input', targetSelector:'input', text: inputText[4]},
      ]
    }
    await interpreter(script);
    const searchValue = await page.$eval('input', el => el.value);
    
    const expectedText = inputText.slice(0, 2) + inputText.slice(4);
    expect(searchValue).toEqual(expectedText);
  });

})

