const goto = require('./goto');
const puppeteer = require('puppeteer');


describe("GOTO Action", () => {
  test("should exist", () => {
    expect(goto).toBeDefined();
  });
  test("should change the current url to destination", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    expect(goto(page, "./fixtures/test.html")).toBeDefined();
  });
})