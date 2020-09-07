const input = async (page, {targetSelector, xpath, text, specialKey, delay}) => {
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
    
    if (specialKey) {
      await elementHandle.press(specialKey);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }

};

module.exports = input;