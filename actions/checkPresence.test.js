const { createBrowser: browserInstance } = require('../lib/browser');
const path = require('path');
const checkPresence = require('./checkPresence');
const {
  ACTION_RESULT_JUMP,
  ACTION_RESULT_END
} = require('../lib/resultActions');

describe("checkPresence Action", () => {
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
      const newURL = `${path.join('file:', __dirname,'fixtures', 'check-presence.html')}`
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
    expect(checkPresence).toBeDefined();
  });

  test("should jump to another step if element does not exist", async () => {
    const result = await checkPresence(page, {
      targetSelector: 'a.non-existing-element',
      onCheckFail: ACTION_RESULT_JUMP,
      stepId: 'some-step-id'
    });
    expect(result.result).toEqual(ACTION_RESULT_JUMP);
    expect(result.stepId).toEqual('some-step-id');
  });

  test("should end script execution if element does not exist", async () => {
    const result = await checkPresence(page, {
      targetSelector: 'a.non-existing-element',
      onCheckFail: ACTION_RESULT_END
    });
    expect(result.result).toEqual(ACTION_RESULT_END);
  });

  test("should jump to another step if element does not exist (xpath)", async () => {
    const result = await checkPresence(page, {
      xpath: '//a[@class="non-existing-element"]',
      onCheckFail: ACTION_RESULT_JUMP,
      stepId: 'some-step-id'
    });
    expect(result.result).toEqual(ACTION_RESULT_JUMP);
    expect(result.stepId).toEqual('some-step-id');
  });

  test("should end script execution if element does not exist (xpath)", async () => {
    const result = await checkPresence(page, {
      xpath: '//a[@class="non-existing-class"]',
      onCheckFail: ACTION_RESULT_END
    });
    expect(result.result).toEqual(ACTION_RESULT_END);
  });

  test("should jump to another step if element exists && invert (xpath)", async () => {
    const result = await checkPresence(page, {
      xpath: '//a[@class="element"]',
      onCheckFail: ACTION_RESULT_JUMP,
      stepId: 'some-step-id',
      invert: true
    });
    expect(result.result).toEqual(ACTION_RESULT_JUMP);
    expect(result.stepId).toEqual('some-step-id');
  });

  test("should jump to another step if element exists && invert", async () => {
    const result = await checkPresence(page, {
      targetSelector: 'a.element',
      onCheckFail: ACTION_RESULT_JUMP,
      stepId: 'some-step-id',
      invert: true
    });
    expect(result.result).toEqual(ACTION_RESULT_JUMP);
    expect(result.stepId).toEqual('some-step-id');
  });

  test("should end script execution if element exists && invert", async () => {
    const result = await checkPresence(page, {
      targetSelector: 'a.element',
      onCheckFail: ACTION_RESULT_END,
      invert: true
    });
    expect(result.result).toEqual(ACTION_RESULT_END);
  });

  test("should end script execution if check fails and no onCheckFail provided", async () => {
    const result = await checkPresence(page, {
      targetSelector: 'a.element',
      invert: true
    });
    expect(result.result).toEqual(ACTION_RESULT_END);
  });
})
