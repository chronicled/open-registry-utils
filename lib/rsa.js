var jsrsasign = require('jsrsasign');
var urn = require('./urn');

module.exports = {
  verify: function(identityURN, hashHex, sigHex) {
    var splitted = urn.split(identityURN);
    // Getting Modulo part
    var modulo = splitted.id.slice(0, splitted.subCats[1] / 4);
    // Getting Exponent part
    var exponent = splitted.id.slice(splitted.subCats[1] / 4);
    exponent = exponent === '' ? '010001' : exponent;

    var sig = new jsrsasign.Signature({'alg': 'SHA1withRSA'});
    sig.init({n: modulo, e: exponent});
    sig.updateHex(hashHex);
    return sig.verify(sigHex);
  }
};
