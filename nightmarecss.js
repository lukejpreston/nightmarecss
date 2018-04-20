import fs from 'fs-extra'
import path from 'path'
import resemble from 'node-resemble-js'
import Nightmare from 'nightmare'
import screenshotSelector from 'nightmare-screenshot-selector'

Nightmare.action('screenshotSelector', screenshotSelector)

const compare = ({fsOptions, name, tolerance, rebase, resembleOptions}) => {
  return new Promise((resolve, reject) => {
    const currentFile = path.join(fsOptions.screenshotDir, `${name}.${fsOptions.currentExtension}.png`)
    const latestFile = path.join(fsOptions.screenshotDir, `${name}.${fsOptions.latestExtension}.png`)
    const diffFile = path.join(fsOptions.screenshotDir, `${name}.${fsOptions.diffExtension}.png`)

    if (rebase || !fs.existsSync(currentFile)) fs.copy(latestFile, currentFile).then(resolve({err: null})).catch(reject)
    else {
      const diff = resemble(currentFile).compareTo(latestFile)
      if (resembleOptions.ignoreAntialiasing) diff.ignoreAntialiasing()
      if (resembleOptions.ignoreNothing) diff.ignoreNothing()
      if (resembleOptions.ignoreColors) diff.ignoreColors()

      diff.onComplete(data => {
        if (parseFloat(data.misMatchPercentage) > tolerance) {
          const stream = fs.createWriteStream(diffFile)
          const packet = data.getDiffImage().pack()
          packet.pipe(stream)
          if (parseFloat(data.misMatchPercentage) > tolerance) resolve({data, err: name})
          else resolve({data, err: null})
        } else resolve({data, err: null})
      })
    }
  })
}

module.exports = (options = {}) => {
  const fsOptions = {
    screenshotDir: path.resolve(process.cwd(), options.screenshotRoot || 'screenshots'),
    diffExtension: options.diffExtension || 'diff',
    currentExtension: options.currentExtension || 'current',
    latestExtension: options.latestExtension || 'latest'
  }

  fs.mkdirpSync(fsOptions.screenshotDir)

  if (options.hasOwnProperty('outputSettings')) resemble.outputSettings(options.outputSettings)

  const tolerance = options.tolerance || 0.05
  let rebase = false
  if (options.hasOwnProperty('rebase')) rebase = options.rebase

  const resembleOptions = {
    ignoreAntialiasing: options.hasOwnProperty('ignoreAntialiasing') ? options.ignoreAntialiasing : true,
    ignoreNothing: options.hasOwnProperty('ignoreNothing') ? options.ignoreNothing : false,
    ignoreColors: options.hasOwnProperty('ignoreColors') ? options.ignoreColors : false
  }

  const names = []
  return (nightmare) => {
    nightmare.screenshotCompare = (name, selector) => {
      names.push(name)
      const latest = path.join(fsOptions.screenshotDir, `${name}.latest.png`)
      if (selector) return nightmare.screenshotSelector({path: latest, selector})
      else return nightmare.screenshot(latest)
    }

    nightmare.compareAll = () => {
      return nightmare
        .end()
        .then(() => Promise.all(names.map(name => compare({fsOptions, name, tolerance, rebase, resembleOptions}))))
        .then((responses) => {
          const errored = responses.filter(response => response.err !== null).map(response => response.err + ' ' + response.data.misMatchPercentage)
          if (errored.length === 1) throw new Error(`failed for: ${errored[0]}`)
          else if (errored.length > 1) throw new Error(`failed for: ${errored.join(', ')}`)
        })
    }

    return nightmare
  }
}
