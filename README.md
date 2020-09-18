# **Meatbot**

### A script runner to automate browsing and getting content from webpages.

#### The original purpose was to automate taking online tickets to a Japanese Yakiniku store.
#### The idea then further grew and developed, so that it can now be utilized to run any script on most pages.

#### (Single page apps, dynamic pages are not  yet fully supported, but can be circumvented by using delays (DELAY or Check presence) :) ) 

***

## **How to Use**:

### **Run the script**

  > ### CLI mode
  ```javascript
  npm run cli <script>  //provide the name of the script inside the "scripts" folder
  ```
  Example 'mdn' script can be used for some simple actions.

  <br>

  > ### server mode
  ```javascript
  TBA
  ```

  <br>

  > ### Run browser as non-headless (actually see pages opening)
  ```javascript
  //create a .env file in the root directory and add `BROWSER_HEADLESS=false`
  ```

  <br>

### **Script composition**
```
{
  delay: <Number>   // delay between each action in ms (defaults to 0 if none is provided)
  actions: [...]    // an array of actions to be performed
}
```

// To Add descrption of which actions automatically terminate with an error, which continue running

<br>

### **Action Descriptions**
>**Notices**:
- Any action supports an `id` parameter that can be used in `CHECK PRESENSE` or `REPEAT`
> `{ id: 'gotoDesiredPage', type: 'goto', destination: 'www.google.com' }`,

- All actions taking a target selector or xpath, will default to xpath if provided with both.

- All obligatory fields will be marked with *

<br>

>`GOTO`

Will navigate the page to the given destination.
```
{
  type: 'goto',
  destination: <webpage URL>,
  waitUntil: <DOM load event>
}
```
* *`destination: <String>` - valid webpage URL adress as a string.

* `waitUntil: <String>` -  Optional Parameter. When to consider navigation succeeded.
  Defaults to `domcontentloaded`. Other options: `"load"|"domcontentloaded"|"networkidle0"|"networkidle2"`.

<br>

>`CLICK`

Clicks the element that matches the given selector or xpath. In case of several matches will click the first match.
```
{
  type: 'click',
  targetSelector: <CSS selector> ,
  xpath: <xpath>,
  waitForNavigation: <bool>
}
```
* *`targetSelector: <String>` - valid CSS selector that will be clicked.
* *`xpath: <String>` - valid XPATH for the element that needs to be clicked. 
* `waitForNavigation: <boolean>` - if click results in navigation to new page, wait for it to end.
  Defaults to `false`. 

<br>

>`INPUT`

Will set the selected text into the chosen element.
```
{
  type: 'input',
  targetSelector: <CSS Selector>,
  xpath: <xpath>,
  text: <text content>,
  specialKey: <key name>,
  delay: <delay in ms>
},
```
* *`targetSelector: <String>` - valid CSS selector that will be clicked.
* *`xpath: <String>` - valid XPATH for the element that needs to be clicked. 
* *`text: <String>` - text content to be written. 
* `specialKey: <String>` - name of additional special key input (for ex. 'Enter').<br>
  [Special key examples](https://github.com/puppeteer/puppeteer/blob/v5.2.1/src/common/USKeyboardLayout.ts)
* `delay: <Integer>` - timeout in ms between every input event (letter) of the text. 

<br>

>`GET`

Retrieve the content of the chosen selector or xpath and save it.
```
{
  type: 'get',
  targetSelector: <CSS Selector>,
  xpath: <xpath>,
  keyName: <key Name>,
  description: <Optional note>,
  overwrite: <bool>
}
```
* *`targetSelector: <String>` - valid CSS selector that will be clicked.
* *`xpath: <String>` - valid XPATH for the element that needs to be clicked. 
* *`keyName: <String>` - a string to act as the key name for the saved data Map.
* `description: <String>` - Note for what is being checked.
* `overwrite: <boolean>` - defaults to `true`.<br>
  When true, if key matches one that already exists, data (value) for that key will be overwritten.
  if set to `false`, data will take the providedKey as Base and generate a new key.

<br>

>`CHECK PRESENSE`

Check the presense of a WANTED element, or absense of a non-desired element.
```
{
  type: 'checkPresence',
  targetSelector: <CSS Selector>,
  xpath: <xpath>,
  description: <Optional note>,
  invert: <bool>,
  onCheckFail: <'jump'|'end'>,
  stepId: <unique Step Id>
}
```
* *`targetSelector: <String>` - valid CSS selector that will be clicked.
* *`xpath: <String>` - valid XPATH for the element that needs to be clicked. 
* `description: <String>` - Note for what is being checked.
* `invert: <boolean>` - defaults to `false`.<br>
  If set to `false`, action SUCCEEDS, when the target element is present.<br>
  If set to `true`, action SUCCEEDS, when the target element is not found.
* *`onCheckFail: <String>` - select an the next action to be performed if CHECK PRESENSE FAILS.<br>
  Options:
  `'end'`. This terminates the further execution of the script.<br> 
  `'jump'` - jump to the action with the ID specified in `stepId`
  Defaults to `'end'`
* `stepId: <String>` - The ID name of the action for the `jump` target. Required for `jump`.
  See Notices *1

  **Please keep in mind that jumping to an action that is before the current check might result in an infinite loop, as execution will continue from the jump destination. See example below.**
  ```
  script = {
    actions: [
      { id:'NavigateToGoogle' type: 'goto', destination: 'www.google.com'},
      {
        type: 'checkPresence',
        description: 'Check if a div with class "custom_div" exists',
        xpath: '//div[@class="custom_div"]',
        onCheckFail: 'jump',
        stepId: 'NavigateToGoogle'
      },
      ...
    ]
  }
  // Since the Google top page does not have a div with such a class, above checkPresense Fails.
  // It then calls a jump to the action with id `NavigateToGoogle`.
  // This runs the first action again and proceeds to the next action.
  // checkPresence fails once again. The result is an infinite loop.
  ```

<br>

>`DELAY`

Pause the execution of the script for a set amount of time before next step.
```
{
  type: 'delay',
  delayTimer: <delay in ms>
},
```
* `delayTimer: <Integer>` - timeout in ms before the next action is called. 

<br>


>`REPEAT`

Repeat a certain action (or several sequential actions a selected number of times)
```
{
  type: 'repeat',
  stepId: <id of action>,
  next: <number of actions>,
  times: <number of repeats>,
  resumeFromLoopEnd: <bool>,
  description: <Optional note>,
},
```
* *`stepId: <String: id name>` - id name of action to be repeated.<br>
  If repeating several actions - becomes the starting point of the loop.<br>
  If not provided, by default, the next action in list will be taken as starting point.
* *`next: <Integer: number of actions>` - number of sequential actions to be repeated.<br>
  If not provided, defaults to 1 item.<br>
  If used together with `stepId`, the designated starting starting action is included in the next count. 
* *`times: <Integer: number of repeats>` - number of total repetitions.<br>
  If not provided defaults to 1 repetition.
* `resumeFromLoopEnd: <boolean>` - defaults to `false`. Used together with `stepId`.<br>
  When `false`, after finishing the REPEAT loop, script execution will resume from the action after the REPEAT declaration.<br>
  If set to `true`, after finishing the REPEAT loop, script execution will continue from where the loop ended.
* `description: <String>` - Note for what is being checked.

**It is possible to break out of the loop prematurely, by adding a CHECK PRESENCE with a JUMP parameter targeted to a step outside of the said loops.**
***

## **Tech and Dev**:

Written in TDD style.

Uses: Nodejs, Puppeteer, Commander.

to start work:

1. `clone the repository`

2. run `npm install`

3. write some scripts (or use the available examples) 

4. start use locally using the cli (See "How to use")

## Next Steps:

- [x] Implement REPEAT action
- [x] add overwrite true/false to GET action
- [x] Add support for scripts passed in json format (for CLI)
- [ ] create a handler for non cli requests
- [ ] Add support for scripts passed in json format (for request handler)
- [ ] setup AWS lambda to run the script
- [ ] setup AWS lambda to read scripts from S3 ?
- [ ] integrate lambda call with slack bot