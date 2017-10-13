# Nightmare CSS

This is a plugin for nightmare so you can do similar things as with phantomcss

## Usage

in this example I am using Jest for testing which supports async testing, but most tests are similar anyway

```js
import Nightmare from 'nightmare'
import NightmareCSS from 'nightmarecss'


test('example screenshot', () => {
    const nightmare = new Nightmare({ show: true })
    nightmare.use(NightmareCSS)
    return nightmare.screenshotCompare(name, options)
})
```

these are the defualt options

```js
{
    // fs
    screenshotRoot: './screenshots',
    diffExtension: 'diff',
    currentExtension: 'current',
    latestExtension: 'latest',

    // nightmarecss
    selector: '.qa-name', // optional
    tolerance: 0.05,
    rebase: false, // replaces .latest.jpg with .failure.jpg

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