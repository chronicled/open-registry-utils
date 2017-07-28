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

const MAX_HEX_ID_LENGTH = 65535;
const RECOGNIZED_PROTOCOLS = [
  //last part should be curve
  'pbk:ec:[a-zA-Z0-9]+',
  //last curve should be RSA key size
  'pbk:rsa:[0-9]+',
  'ble:1\.0',
  'nfc:1\.0',
  'sn',
  'hash:argon',
  'hash:id'
];
const allowedProtocolsRegExp = new RegExp('^' + RECOGNIZED_PROTOCOLS.join('|^'));

module.exports = {
  recognizedProtocols: RECOGNIZED_PROTOCOLS,
  isRecognizedProtocol: function(urn) {
    return urn.match(allowedProtocolsRegExp);
  },
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
    if (typeof urns === 'string') {
      urns = [urns];
    }
    for (var index in urns) {
      var urn = urns[index];
      var validUrnRegExp = /^([^:]+:)+[^:]+$/;
      if (urn.match(validUrnRegExp)) {
        return true;
      } else {
        return "Invalid URN format";
      }
    }
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
      } else if (schemaLength > 255) {
        throw new Error('Maximum length of URN schema is 255');
      }

      var schema = identity.slice(0, schemaLength);
      var id = identity.slice(schemaLength + 1);
      var schemaHex = stringToHex(schema);
      var idHex = identity.match(allowedProtocolsRegExp) ? id : stringToHex(id);
      var idLength = idHex.length / 2;

      if (idLength <= 0) {
        throw new Error('ID is empty');
      } else if (idLength > MAX_HEX_ID_LENGTH) {
        throw new Error(`Maximum length of ID is ${MAX_HEX_ID_LENGTH}`);
      } else if (idLength != idLength.toFixed()) {
        throw new Error('Hex chars are of odd count');
      }

      var schemaPart = ('0' + schemaLength.toString(16)).slice(-2) + schemaHex;
      var idPart = ('000' + idLength.toString(16)).slice(-4) + idHex;
      return schemaPart + idPart;

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
        var idHex = encoded.slice(nextIndex + (1 + schemaLength + 2) * 2, nextIndex + (1 + schemaLength + 2 + idLength) * 2);
        var id = schema.match(allowedProtocolsRegExp) ? idHex : hexToString(idHex);
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
