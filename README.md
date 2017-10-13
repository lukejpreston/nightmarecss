# Nightmare CSS

This is a plugin for nightmare so you can do similar things as with phantomcss

## Installation

```
npm i -D nightmarecss
```

## Usage

in this example I am using Jest for testing which supports async testing, but most tests are similar anyway

```js
import Nightmare from 'nightmare'
import NightmareCSS from 'nightmarecss'

test('example screenshot', () => {
    const nightmare = new Nightmare()
    nightmare.use(NightmareCSS(options))
    return nightmare
        .screenshotCompare('name-1')
        .screenshotCompare('name-2')
        .screenshotCompare('name-3')
        .end()
        .compareAll() // we will call nightmare.end() for you if you haven't called it before this, so you will not be able to do anything after compareAll
})
```

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

## Developing

install, test, lint, dist

```bash
npm i
npx jest
npx eslint ./nightmare*.js
npx babel nightmarecss.js --out-file index.js
```

you can also use `npm`

```bash
npm test
npm dist
```

## Missing selector

here is what I want

```js
nightmare.screenshotCompare('name', '.qa-name')
```

I have tried doing this using `Nightmare.actions` as opposed to using a plugin but async seems to be a bit of an issue when snapshotting

If you want this feature please fork it and create a PR