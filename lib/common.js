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

const urnLib = require('./urn');
const ecLib = require('./ec');
const _ = require('lodash');

module.exports = {
  compressAll: function(urns) {
    if (typeof urns === 'string') {
      urns = [urns];
    }
    var compressed = urns.map(function(urn) {
      const parsed = urnLib.split(urn);
      const canCompress = _.last(parsed.subCats || []) === 'secp256r1';

      if(canCompress && parsed.id.slice(0, 2) === '04') {
        return urnLib.create(parsed.cat, parsed.subCats, ecLib.compress(parsed.id));
      }
      return urn;
    });
    return compressed;
  }
};
