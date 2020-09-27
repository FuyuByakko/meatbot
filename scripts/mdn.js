
module.exports = {
  actionDelay: 500,
  actions: [
    { id: 'start', type: 'goto', destination: 'https://developer.mozilla.org/en-US/' },
    { type: 'input', targetSelector: '.search-input-field', text: `String split`, specialKey: "Enter", waitForNavigation: true },
    { type: 'click', targetSelector: '#react-container > div.search-results > div:nth-child(2) > div > div:nth-child(1) > a', waitForNavigation: true},
    { type: 'get', xpath: '//span[@class="seoSummary"]', keyName: 'string.split summary', description: "Save the string.split summary."},
    { type: 'checkPresence', targetSelector: '.bc-browser-edge', onCheckFail: 'jump', stepId: 'finish', invert: true },
    { id: 'finish', type: 'goto', destination: 'https://google.com/'}
  ]
};
