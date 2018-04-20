# Nightmare CSS

This is a plugin for nightmare so you can do similar things as with phantomcss

## Installation

```bash
npm i -D nightmarecss
```

## Usage

Example jest test

```js
import Nightmare from 'nightmare'
import NightmareCSS from './nightmarecss'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000

let nightmare = null
beforeEach(() => {
  nightmare = new Nightmare()
  nightmare.use(NightmareCSS({rebase: process.env.REBASE || false}))
})

afterEach(() => {
  nightmare.halt()
})

test('checking', () => {
  return nightmare
    .goto('http://google.com')
    .screenshotCompare('google')
    .screenshotCompare('google-input', '.lst-c')
    .compareAll()
})
```

this will create:
    `./screenshots/google.current.png`
    `./screenshots/google.latest.png`
    `./screenshots/google-input.current.png`
    `./screenshots/google-input.latest.png`

and if there is a diff then it will create appropriate `*.diff.png` files

### screenshotCompare

if you want to get the default screenshot

`screenshotCompare('google')`

if you want to use a selector

`screenshotCompare('google-input', '.lst-c')`

### compareAll

`compareAll()`

this will call `.end` for you so don't have to call it as part of your test, if you want to continue to do this after this; chain `.then`

### options

these are the defualt options

see [Resemble.js](https://github.com/Huddle/Resemble.js) for more details

```js
{
    // fs
    screenshotRoot: './screenshots',
    diffExtension: 'diff',
    currentExtension: 'current',
    latestExtension: 'latest',

    // nightmarecss
    tolerance: 0.05,
    rebase: false, // replaces .latest.jpg with .current.jpg

    // resemble options
    ignoreAntialiasing: true,
    ignoreNothing: false,
    ignoreColors: false,
    outputSettings: {
        errorColor: {
            red: 255,
            green: 255,
            blue: 0
        },
        errorType: 'movement',
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false
    }
}
```

## Jasmine and Jest

you might want to put

```js
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000
```

in your tests, depends on how quick your machine is if you need it but makes tests a little more stable for slow machines

## Rebasing

in the example above you can do `NightmareCSS({rebase: process.env.REBASE || false})` which means you can run

```bash
REBASE=true npm test
```

and it will rebase your images

## Git Ignore

You will want to add this to your git ignore

```gitignore
*.diff.png
*.latest.png
```

you don't want to commit these files

## Developing

install, test, lint, dist

```bash
npm i
npm test
npm run lint
npm ci
npx dist
```
