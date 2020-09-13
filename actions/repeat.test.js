const browserInstance = require('../lib/browser');
const path = require('path');
const checkPresence = require('./checkPresence');
const {
  ACTION_RESULT_REPEAT,
} = require('../lib/resultActions');
const repeat = require('./repeat');

describe("checkPresence Action", () => {
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
    const newURL = `${path.join('file:', __dirname,'fixtures', 'check-presence.html')}`
    await page.goto(newURL);
  });

  afterEach(async () => {
    await page.close()
  });

  test("should exist", () => {
    expect(checkPresence).toBeDefined();
  });

  test("should return result object with action_result_repeat", async () => {
    const result = repeat(page, {
      next: 10,
      times: 10
    });
    expect(result.result).toEqual(ACTION_RESULT_REPEAT);
  });

  test("should have a loopInfo property", () => {
    const result = repeat(page, {
      next: 10,
      times: 10
    });
    expect(result.loopInfo).toBeDefined();
  });

  test("should default to 1 repeat if times property NOT provided", () => {
    const result = repeat(page, {
      next: 10,
    });
    const expectedRepeats = 1;
    expect(result.loopInfo.times).toEqual(expectedRepeats);
  });
  
  test("should have the times property if provided", () => {
    const timesToRepeat = 15;
    const result = repeat(page, {
      next: 10,
      times: timesToRepeat
    });
    expect(result.loopInfo.times).toEqual(timesToRepeat);
  });
  
  
  test("should have the next property if provided", () => {
    const expectedNextSteps = 3;
    const result = repeat(page, {
      next: expectedNextSteps,
    });
    expect(result.loopInfo.next).toEqual(expectedNextSteps);
  });
  
  test("should default to 1 next step if no next provided", () => {
    const expectedNextSteps = 1;
    const result = repeat(page, {
    });
    expect(result.loopInfo.next).toEqual(expectedNextSteps);
  });
  
  test("should have the stepId property if provided", () => {
    const expectedStepId = 'Test_Id';
    const result = repeat(page, {
      stepId: expectedStepId,
    });
    expect(result.loopInfo.stepId).toEqual(expectedStepId);
  });

  test("should have the provided stepId and next properties", () => {
    const expectedNextSteps = 3;
    const expectedStepId = 'Test_Id';
    const result = repeat(page, {
      stepId: expectedStepId,
      next: expectedNextSteps,
    });
    expect(result.loopInfo.stepId).toEqual(expectedStepId);
    expect(result.loopInfo.next).toEqual(expectedNextSteps);
  });

  test("should have the resumeFromLoopEnd property as false not provided", () => {
    const result = repeat(page, {});
    expect(result.loopInfo.resumeFromLoopEnd).toEqual(false);
  });

  test("should have the resumeFromLoopEnd property as true if provided as such", () => {
    const result = repeat(page, {
      resumeFromLoopEnd: true
    });
    expect(result.loopInfo.resumeFromLoopEnd).toEqual(true);
  });

})
