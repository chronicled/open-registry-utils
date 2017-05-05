// Copyright 2016 Chronicled
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = {
  split: function(urn) {
    var err = this.check(urn);

    if (typeof err === 'string') {
      console.log(err);
      return false;
    }
    else {
      return {
        cat: urn.split(':')[0],
        subCats: urn.split(':').slice(1, -1),
        id: urn.split(':').slice(-1)[0]
      };
    }
  },
  check: function(urns) {
    var allowedProtocols = [
      'pbk:ec:secp256r1',
      'pbk:rsa:2048',
      'ble:1\.0',
      'nfc:1\.0',
      'sn',
      'hash:argon',
      'hash:id'
    ];
    var allowedProtocolsRegExp = new RegExp('^' + allowedProtocols.join(':[^:]+$|^') + ':[^:]+$');
    if (typeof urns === 'string') {
      urns = [urns];
    }
    for (var index in urns) {
      var urn = urns[index];
      if (!urn.match(allowedProtocolsRegExp) && urn.match(/^([^:]+:)+[^:]+$/)) {
        return true;
      }

      // Parse ID portion of URN
      var cat = urn.split(':').slice(0, -1)
      var id = urn.split(':').slice(-1)[0];

      if (id.length % 2 !== 0) {
        return 'Identity must have even length and be in proper format';
      }

      // Split identity by each byte
      var charArr = id.match(/.{1,2}/g);

      // Match category of URN
      switch (cat) {
        case 'pbk:ec:secp256r1':
          // Check for compressed/uncompressed ECDSA public keys
          if (charArr[0] === '02' || charArr[0] === '03') {
            // Check length of compressed public key
            if (charArr.length !== 33) {
              return 'Incorrect compressed public key byte length: Compressed public keys are 33 bytes long: 32 bytes for coordinate, 1 byte for coordinate sign';
            }
          } else if (charArr[0] === '04') {
            // Check length of uncompressed public key
            if (charArr.length !== 65) {
              return 'Incorrect uncompressed public key byte length: Uncompressed keys should be 1 byte + 32 bytes for x coordinate + 32 bytes for x coordinate';
            }
          }

          break;
        case 'pbk:rsa:2048':
          // Grab RSA exponent if it exists
          if (id.length < 512) {
            return 'Improper data length, should be 2048 bits compressed into 256 bytes';
          } else if (id.length > 512) {
            exponent = id.substring(512, id.length);
            if (exponent.length % 2 !== 0) {
              return 'Improper exponent length, should be even character count in hex format';
            }
          }

          break;

        // BLE ids are standardized with a 6 bytes MAC address
        case 'ble:1\.0':
          if (charArr.length !== 6) {
            return 'Incorrect BLE identity, BLE ids are standardized at a fixed 6 byte length';
          }

          break;

        // NFC ids come in 4,7, and 10 bytes variants
        // Validation specs: www.nxp.com/documents/application_note/AN10927.pdf
        case 'nfc:1\.0':
          if (charArr.length === 4) {
            // UID0 byte cannot be '0x88'
            if (charArr[0] === '88') {
              return 'Incorrect NFC identity specification: Wrong first byte';
            }
          } else if (charArr.length === 7 || charArr.length === 10) {
            // UID3 byte cannot be '0x88'
            if (charArr[3] === '88') {
              return 'Incorrect NFC identity specification: Wrong third byte';
            }
          } else {
            return 'Incorrect NFC identity specification: Wrong byte length';
          }

          break;
        case 'sn':
          break;
        case 'hash:argon':
          break;
        case 'hash:id':
          break;
      }
    }

    return true;
  },
  create: function(cat, subCats, id) {
    var newURN = cat;
    for (var i = 0; i < subCats.length; i++) {
      newURN += ':' + subCats[i];
    }
    newURN += ':' + id;
    return newURN;
  },
  toBase64: function(urn) {
    var splited = this.split(urn);
    if (splited) {
      return false;
    }
    else {
      return (splited.cat + ':' + splited.subCats + ':' + new Buffer(splited.id).toString('base64'));
    }
  },
  packer: {
    encode: function(identity) {
      var schemaLength = identity.lastIndexOf(':');

      if (schemaLength <= 0) {
        throw new Error('Wrong fomatting');
      }

      if (schemaLength > 255) {
        throw new Error('Maximum length of URN schema is 255');
      }

      // Each hex char is 4 bits
      var idLength = (identity.length - schemaLength - 1) / 2;

      if (idLength != idLength.toFixed()) {
        throw new Error('Hex chars are of odd count');
      }

      if (idLength <= 0) {
        throw new Error('ID is empty');
      }

      if (idLength > 65535) {
        throw new Error('Maximum length of ID is 65535');
      }

      return ('0' + schemaLength.toString(16)).slice(-2) +
             stringToHex(identity.slice(0, schemaLength)) +
             ('000' + idLength.toString(16)).slice(-4) +
             identity.slice(schemaLength + 1);
    },
    chunk: function(hex) {
      var chunks = hex.match(/.{2,64}/g);
      // Pad with zeros
      var last = chunks[chunks.length - 1];
      chunks[chunks.length - 1] = last + (Array(64 + 1 - last.length).join('0'));
      return chunks.map(function(chunk) {return '0x' + chunk});
    },
    encodeAndChunk: function(identities) {
      if (typeof(identities) == 'string') {
        identities = [identities];
      }

      var result = [];
      identities.forEach((function(identity) {
        result = result.concat(this.chunk(this.encode(identity)));
      }).bind(this));

      return result;
    },
    // Accepts both chunks array and hex string
    decode: function(encoded) {
      if (encoded instanceof Array) {
        encoded = encoded.map(function(chunk) {return chunk.replace(/^0x/g, '')}).join('');
      }

      // Each symbol is 4 bits
      var result = [];
      var nextIndex = 0;
      while (nextIndex < encoded.length) {
        var schemaLength = parseInt(encoded.slice(nextIndex, nextIndex + 1 * 2), 16);
        var idLength = parseInt(encoded.slice(nextIndex + (1 + schemaLength) * 2, nextIndex + (1 + schemaLength + 2) * 2), 16);

        var schema = encoded.slice(nextIndex + 1 * 2, nextIndex + (1 + schemaLength) * 2);
        // Convert to string
        schema = hexToString(schema);
        var id = encoded.slice(nextIndex + (1 + schemaLength + 2) * 2, nextIndex + (1 + schemaLength + 2 + idLength) * 2);

        result.push(schema + ':' + id);

        // Get full cells
        var cellsPerId = Math.ceil((1 + schemaLength + 2 + idLength) / 32);
        nextIndex += cellsPerId * 32 * 2;
      }

      return result;
    }
  }
};

function stringToHex(str) {
  var hex, i;

  var result = '';
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ('00' + hex).slice(-2);
  }

  return result;
}

function hexToString(hex) {
  var j;
  var hexes = hex.match(/.{1,2}/g) || [];
  var back = '';
  for(j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}
