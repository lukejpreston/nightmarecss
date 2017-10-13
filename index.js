export default (nightmare) => {
  nightmare.screenshotCompare = () => {
    return nightmare
      .screenshot('latest.png')
  }
  return nightmare
}
