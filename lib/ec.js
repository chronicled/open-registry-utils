var BigInteger = require('bigi');
var Crypto = require('ezcrypto').Crypto;
var jsrsasign = require('jsrsasign');
var urn = require('./urn');

module.exports = {
  getYbyX: function(xInHex, isYEven) {
    // Get integer x
    var x = this.hexToBigInteger(xInHex);

    // secp256r1 curve params which are needed
    var p = new BigInteger('115792089210356248762697446949407573530086143415290314195533631308867097853951');
    var a = new BigInteger('115792089210356248762697446949407573530086143415290314195533631308867097853948');
    var b = new BigInteger('41058363725152142129326129780047268409114441015993725554835256314039467401291');

    // We precalculate (p + 1) / 4 where p is if the field order
    P_OVER_FOUR = p.add(BigInteger.ONE).divide(BigInteger.valueOf(4));

    // Convert x to point
    var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
    var beta = alpha.modPow(P_OVER_FOUR, p);

    // If beta is even, but y isn't or vice versa, then convert it,
    // otherwise we're done and y == beta.
    var y = (beta.isEven() ? isYEven : !isYEven) ? beta : p.subtract(beta);

    var hex = bytesToHex( integerToBytes(y));
    return ('0000000000' + hex).slice(-64);
  },

  verify: function (hashHex, sigHex, publicKey) {
    var publicKeyHex = this.decompress(urn.split(publicKey).id);
    var ec = new jsrsasign.ECDSA({'curve': 'secp256r1'});
    return ec.verifyHex(hashHex, sigHex, publicKeyHex);
  },

  // Hex string
  compress: function(publicKey) {
    if (publicKey.slice(0, 2) != '04') {
      throw new Error('Incorrect public key format. Wrong prefix.');
    }

    if (publicKey.length != (64 + 1) * 2) { // 64 bytes X and Y plus 1 prefix byte
      throw new Error('Incorrect public key format. Wrong length.');
    }

    return this.compressCoordinate(publicKey.slice(2, 66), publicKey.slice(66, 130));
  },

  decompress: function(publicKey) {
    var coords = this.decompressToCoordinate(publicKey);
    return '04' + coords.x + coords.y;
  },

  // Inputs are in HEX
  compressCoordinate: function(x, y) {
    // 02 / 03 as used in Bitcoin
    if (this.hexToBigInteger(y).isEven()) {
      var prefix = '02';
    }
    else {
      var prefix = '03';
    }

    return prefix + x;
  },

  // HEX input
  decompressToCoordinate: function(compressed) {
    if (compressed.length != (32 + 1) * 2) {
      throw new Error('Wrong length');
    }

    var prefix = compressed.slice(0, 2);
    var x = compressed.slice(2);

    if (prefix === '02') {
      var y = this.getYbyX(x, true);
    }
    else if (prefix === '03') {
      var y = this.getYbyX(x, false);
    }
    else {
      throw new Error('Incorrect prefix');
    }

    return {x: x, y: y};
  },

  hexToBigInteger: function (hex) {
    return BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(hex));
  }
}

function integerToBytes(e, t) {
  var n = e.toByteArrayUnsigned();
  if (t < n.length) {
    n = n.slice(n.length - t);
  }
  else {
    while (t > n.length) {
      n.unshift(0);
    }
  }
  return n;
}

function bytesToHex(bytes) {
  var hexChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

  function byteToHex(b) {
    return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
  }

  return bytes.map(byteToHex).join('');
}
