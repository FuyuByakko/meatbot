const config = {
  loginUrl: 'https://epark.jp/',
  restaurantUrl: 'https://epark.jp/detail/wait/5279',
  selectors: {
    loginButton: 'a.login',
    username: 'input[name="auth_login[username]"]',
    password: 'input[name="auth_login[password]"]',
    submitLoginInfo: 'button[type=submit]',
    invalidCredentials: '//strong[contains(text(),"入力内容に誤りがある")]',
    outsideWorkingHours: '//strong[contains(text(),"ただいま営業時間外です。")]',
    ticketNotAvailable: '//strong[contains(text(),"現在、サイトからの受付を行っておりません。")]',
    getTicketButton: 'a.ubutton',
    numOfPeopleInput: "input[name='reserve[shop_reserve_category_value_1]']",
    preferedSeatSelector: "input[value='492641']",
    acceptTermsButton: "input[value='492645']",
    nextBtn: 'input[type=submit]',

  }
};

const username = process.env.LOGIN_USER || '';
const password = process.env.LOGIN_PASS || '';

module.exports = {
  actionDelay: 0,
  actions: [
    { type: 'goto', destination: config.loginUrl},
    { type: 'click', targetSelector: config.selectors.loginButton, waitForNavigation: true},
    { type: 'input', targetSelector: config.selectors.username, text: username},
    { type: 'input', targetSelector: config.selectors.password, text: password},
    { type: 'click', targetSelector: config.selectors.submitLoginInfo, waitForNavigation: true},
    {
      type: 'checkPresence',
      description: 'Invalid login credentials',
      xpath: config.selectors.invalidCredentials,
      invert: true,
      onCheckFail: 'end'
    },
    { id: 'gotoRestaurantPage', type: 'goto', destination: config.restaurantUrl },
    {
      type: 'checkPresence',
      description: 'Restaurant is outside of working hours',
      xpath: config.selectors.outsideWorkingHours,
      invert: true,
      onCheckFail: 'end'
    },
    {
      type: 'checkPresence',
      description: 'Ticket is not available yet',
      xpath: config.selectors.ticketNotAvailable,
      invert: true,
      onCheckFail: 'jump',
      stepId: 'gotoRestaurantPage'
    },
    {
      type: 'checkPresence',
      description: 'Ensure get ticket button exists',
      targetSelector: config.selectors.getTicketButton
    },
    { type: 'click', targetSelector: config.selectors.getTicketButton, waitForNavigation: true },
    { type: 'input', targetSelector: config.selectors.numOfPeopleInput, text: '3'},
    { type: 'click', targetSelector: config.selectors.preferedSeatSelector },
    { type: 'click', targetSelector: config.selectors.acceptTermsButton },
    { type: 'click', targetSelector: config.selectors.nextBtn, waitForNavigation: true },
    { type: 'click', targetSelector: config.selectors.nextBtn, waitForNavigation: true }
  ]
};
