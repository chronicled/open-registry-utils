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
  slice: function(bytes) {
    bytes = bytes.replace('0x', '');
    var slices = [];
    while (bytes.length > 64) {
      slices.push('0x' + bytes.substring(0, 64));
      bytes = bytes.substring(64, bytes.length);
    }
    slices.push('0x' + bytes);
    return slices;
  },
  merge: function(bytes32Array) {
    var merged = '0x';
    for (var i = 0; i < bytes32Array.length; i++) {
      merged += bytes32Array[i].replace('0x', '');
    }
    return merged;
  }
};
