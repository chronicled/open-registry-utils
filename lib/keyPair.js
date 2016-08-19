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
