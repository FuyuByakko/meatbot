
module.exports = {
  actionDelay: 2000,
  actions: [
    { type: 'goto', destination: 'https://developer.mozilla.org/en-US/'},
    { type: 'input', targetSelector: '.search-input-field', text: `String split${String.fromCharCode(13)}`},
    { type: 'click', targetSelector: '#react-container > div.search-results > div:nth-child(2) > div > div:nth-child(1) > a', waitForNavigation: true},
  ]
};