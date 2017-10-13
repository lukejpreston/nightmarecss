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
    return nightmare.screenshotCompare({
        selector: 'selector',
        window: false,
        {...resembleOptions}
    })
})

```