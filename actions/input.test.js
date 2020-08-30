const input = require('./input');
const puppeteer = require('puppeteer');
( async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
})


describe("Input Action", () => {
  test("should exist", () => {
    expect(input).toBeDefined();
  });
  
})