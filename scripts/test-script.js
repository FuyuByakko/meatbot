const selectors = {

};

module.exports = {
  actionDelay: 0,
  actions: [
    { type: 'goto', destination: 'https://epark.jp/'},
    { type: 'click', targetSelector: 'a.login', waitForNavigation: true},
    { type: 'input', targetSelector: 'input[name="auth_login[username]"]', text: ''},
    { type: 'input', targetSelector: 'input[name="auth_login[password]"]', text: ''},
    { type: 'click', targetSelector: 'button[type=submit]', waitForNavigation: true},
    { type: 'checkPresence', targetSelector: 'invalid id and password', onCheckFail: 'repeatFrom', step: 'start', invert: true }
  ]
};