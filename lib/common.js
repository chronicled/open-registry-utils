var urnLib = require('./urn');
var ecLib = require('./ec');

module.exports = {
  compressAll: function(urns) {
    if (typeof urns === 'string') {
      urns = [urns];
    }
    var compressed = urns.map(function(urn) {
      var splitResult = urnLib.split(urn);
      if(splitResult.subCats[0] === 'ec' && splitResult.id.slice(0, 2) === '04') {
        return urnLib.create(splitResult.cat, splitResult.subCats, ecLib.compress(splitResult.id));
      }
      return urn;
    });
    return compressed;
  }
};