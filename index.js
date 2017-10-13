'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeResembleJs = require('node-resemble-js');

var _nodeResembleJs2 = _interopRequireDefault(_nodeResembleJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compare = function compare(_ref) {
  var fsOptions = _ref.fsOptions,
      name = _ref.name,
      tolerance = _ref.tolerance,
      rebase = _ref.rebase,
      resembleOptions = _ref.resembleOptions;

  return new Promise(function (resolve, reject) {
    var currentFile = _path2.default.join(fsOptions.screenshotDir, name + '.' + fsOptions.currentExtension + '.png');
    var latestFile = _path2.default.join(fsOptions.screenshotDir, name + '.' + fsOptions.latestExtension + '.png');
    var diffFile = _path2.default.join(fsOptions.screenshotDir, name + '.' + fsOptions.diffExtension + '.png');

    if (rebase || !_fsExtra2.default.existsSync(currentFile)) _fsExtra2.default.copy(latestFile, currentFile).then(resolve({ err: null })).catch(reject);else {
      var diff = (0, _nodeResembleJs2.default)(currentFile).compareTo(latestFile);
      if (resembleOptions.ignoreAntialiasing) diff.ignoreAntialiasing();
      if (resembleOptions.ignoreNothing) diff.ignoreNothing();
      if (resembleOptions.ignoreColors) diff.ignoreColors();

      diff.onComplete(function (data) {
        if (parseFloat(data.misMatchPercentage) > tolerance) {
          var stream = _fsExtra2.default.createWriteStream(diffFile);
          var packet = data.getDiffImage().pack();
          packet.pipe(stream);
          if (parseFloat(data.misMatchPercentage) > tolerance) resolve({ data: data, err: name });else resolve({ data: data, err: null });
        } else resolve({ data: data, err: null });
      });
    }
  });
};

module.exports = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var fsOptions = {
    screenshotDir: _path2.default.resolve(process.cwd(), options.screenshotRoot || 'screenshots'),
    diffExtension: options.diffExtension || 'diff',
    currentExtension: options.currentExtension || 'current',
    latestExtension: options.latestExtension || 'latest'
  };

  _fsExtra2.default.mkdirpSync(fsOptions.screenshotDir);

  if (options.hasOwnProperty('outputSettings')) _nodeResembleJs2.default.outputSettings(options.outputSettings);

  var tolerance = options.tolerance || 0.05;
  var rebase = false;
  if (options.hasOwnProperty('rebase')) rebase = options.rebase;

  var resembleOptions = {
    ignoreAntialiasing: options.hasOwnProperty('ignoreAntialiasing') ? options.ignoreAntialiasing : true,
    ignoreNothing: options.hasOwnProperty('ignoreNothing') ? options.ignoreNothing : false,
    ignoreColors: options.hasOwnProperty('ignoreColors') ? options.ignoreColors : false
  };

  var names = [];
  return function (nightmare) {
    nightmare.screenshotCompare = function (name) {
      names.push(name);
      var latest = _path2.default.join(fsOptions.screenshotDir, name + '.latest.png');
      return nightmare.screenshot(latest);
    };

    nightmare.compareAll = function () {
      return nightmare.end().then(function () {
        return Promise.all(names.map(function (name) {
          return compare({ fsOptions: fsOptions, name: name, tolerance: tolerance, rebase: rebase, resembleOptions: resembleOptions });
        }));
      }).then(function (responses) {
        var errored = responses.filter(function (response) {
          return response.err !== null;
        }).map(function (response) {
          return response.err + ' ' + response.data.misMatchPercentage;
        });
        if (errored.length === 1) throw new Error('failed for: ' + errored[0]);else if (errored.length > 1) throw new Error('failed for: ' + errored.join(', '));
      });
    };

    return nightmare;
  };
};
