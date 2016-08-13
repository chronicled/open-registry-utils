var jsrsasign = require('jsrsasign');

module.exports = {
  generate: function(type) {
    if (type == 'secp256r1') {
      var curve = new jsrsasign.ECDSA({'curve': 'secp256r1'});
      var pair = curve.generateKeyPairHex();
      pair.pub64 = new Buffer(pair.ecpubhex).toString('base64');
      return (pair);
    }
    else if (type == 'secp256k1') {
      var curve = new jsrsasign.ECDSA({'curve': 'secp256k1'});
      var pair = curve.generateKeyPairHex();
      pair.pub64 = new Buffer(pair.ecpubhex).toString('base64');
      return (pair);
    }
    else if (type == 'secp384r1') {
      var curve = new jsrsasign.ECDSA({'curve': 'secp384r1'});
      var pair = curve.generateKeyPairHex();
      pair.pub64 = new Buffer(pair.ecpubhex).toString('base64');
      return (pair);
    }
    else {
      throw 'Invalid algorithm type';
    }
  }
};
