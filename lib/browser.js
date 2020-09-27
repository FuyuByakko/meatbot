let browserInstance = null;

const createBrowser = async () => {
  const lambdaEnv = process.env.LAMBDA_ENV
  if (browserInstance) {
    return browserInstance;
  }
  if (lambdaEnv === 'true') {
    browserInstance = await createServerlessBrowser();
  } else {
    browserInstance = await createLocalBrowser();
  }
  return browserInstance;
}

const closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close()
  }
  browserInstance = null;
}

const createServerlessBrowser = async () => {
  console.log('Starting up chromium for Lambda.');
  const chromeLambda = require("chrome-aws-lambda");
  console.log(`Running in ${chromeLambda.headless ? 'headless' : 'non-headless' } mode.`);
  const browser = await chromeLambda.puppeteer.launch({
    args: chromeLambda.args,
    executablePath: await chromeLambda.executablePath,
    headless: chromeLambda.headless,
    defaultViewport: chromeLambda.defaultViewport,
  });
  return browser;
}

const createLocalBrowser = async () => {
  console.log('Starting up chromium local');
  const puppeteer = require('puppeteer');
  const isHeadless = process.env.BROWSER_HEADLESS === "false" ? false : true;
  console.log(`Running in ${isHeadless ? 'headless' : 'non-headless' } mode.`);
  let browser = await puppeteer.launch({headless: isHeadless});
  return browser;
}

module.exports.createBrowser = createBrowser;
module.exports.closeBrowser = closeBrowser;
