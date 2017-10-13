import Nightmare from 'nightmare'
import NightmareCSS from './nightmarecss'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000

let nightmare = null
beforeEach(() => {
  nightmare = new Nightmare({ show: false })
  nightmare.use(NightmareCSS({rebase: true}))
})

afterEach(() => {
  nightmare.halt()
})

test('checking', () => {
  return nightmare
    .goto('http://google.com')
    .screenshotCompare('google')
    .compareAll()
})
