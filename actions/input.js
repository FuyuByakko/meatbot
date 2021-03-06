const input = async (page, {targetSelector, xpath, text, specialKey, delay, waitForNavigation = false}) => {

  //TODO - potentially add waitFofNavigation ( as for ex. SpecialKey 'Enter' can cause form submit)
  try {
    let elementHandle;

    if (targetSelector) {
      elementHandle = await page.$(targetSelector);
    }

    if (xpath) {
      let elementHandleArr = await page.$x(xpath);
      if (elementHandleArr.length > 0) {
        elementHandle = elementHandleArr[0];
      }
    }

    if (!elementHandle) {
      throw new Error('xpath or targetSelector cannot be found on page.')
    }

    await elementHandle.type(text, {delay: delay});
    
    const specialTasks = []
    if (specialKey) {
      specialKeyPress = elementHandle.press(specialKey);
      specialTasks.push(specialKeyPress);
    }
    if (waitForNavigation) {
      specialTasks.push(page.waitForNavigation());
    }
    await Promise.all(specialTasks);

  } catch (error) {
    console.error(error.message);
    throw error;
  }

};

module.exports = input;