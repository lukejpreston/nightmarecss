import Nightmare from 'nightmare'
import NightmareCSS from '.'
// import fs from 'fs-extra'
// import path from 'path'
// import resemble from 'node-resemble-js'

let nightmare = null
beforeEach(() => {
  nightmare = new Nightmare({ show: false })
  nightmare.use(NightmareCSS)
})

afterEach(() => {
  nightmare.halt()
})

test('checking', () => {
  return nightmare
    .goto('http://google.com')
    .screenshotCompare()
    .end()
})
