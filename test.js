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

var utils = require('./index.js');

// Example keys.
// Todo: generate keys dynamically

// X, Y
var keys = [
  ['08e07141e07e622242f954dc89b656597a23a4dd3d212987c8cc0d827deccf7b', '704e94fb02bf21f54f622a9cdcb6a34981b91735d8227120a11c1b7eee983c51'],
  ['0b6a054d8270713c90f8b2bffe82430ed3e9dcc3ba85dd578f8de78acecdcb40', 'd0421fbf709d2678be6388290027c61d37d7845deb13ac96c6ec872c36236241'],
  ['644c762399ba9fcf2d8e144102cbbe94f2f034a3150846c3a09d7e146ff93559', '7f7ec2aab87182cf27f1d401b73c88578618e624eec99c5019e25f2f5b5acc90'],
]
console.log('Test EC utils:');
keys.map( function( key ) {
  // console.log(ec.getYbyX(key[0]), ec.hexToBigInteger(key[1]).isEven() );
  console.log( utils.ec.getYbyX(key[0], utils.ec.hexToBigInteger(key[1]).isEven() ) == key[1].toUpperCase() )
} )

keys.map( function( key ) {
  console.log( utils.ec.decompressToCoordinate( utils.ec.compressCoordinate(key[0], key[1]) ).y  == key[1].toUpperCase() )
} )

keys.map( function( key ) {
  var uncompressed = '04' + key[0] + key[1];
  console.log(utils.ec.decompress( utils.ec.compress(uncompressed) ).toLowerCase()  == uncompressed.toLowerCase());
} )

console.log('');
console.log('Verify EC:','af2bdbe1aa9b6ec1e2ade1d694f41fc71a831d0268e9891562113d8a62add1bf ; 3046022100efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716022100f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8 ; pbk:ec:secp256r1:0360FED4BA255A9D31C961EB74C6356D68C049B8923B61FA6CE669622E60F29FB6');
console.log('should be true:',utils.ec.verify('pbk:ec:secp256r1:0360FED4BA255A9D31C961EB74C6356D68C049B8923B61FA6CE669622E60F29FB6', 'af2bdbe1aa9b6ec1e2ade1d694f41fc71a831d0268e9891562113d8a62add1bf','3046022100efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716022100f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8'))
console.log('should be false:',utils.ec.verify('pbk:ec:secp256r1:0360FED4BA255A9D31C961EB74C6356D68C049B8923B61FA6CE669622E60F29FB6', 'af2bdbe1aa9b6ec1e2ade1d694441fc71a831d0268e9891562113d8a62add1bf','3046022100efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716022100f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8'))

console.log('');
console.log('Generate new key pair');
var newKeyPair = utils.keyPair.generate('secp256r1');
console.log('newKeyPair:',newKeyPair);

var pubKeyCompress = utils.ec.compress(newKeyPair.ecpubhex);
console.log('pubKeyCompress from newKeyPair:',pubKeyCompress);

var newURN = utils.urn.create('pbk',['ec','secp256r1'],pubKeyCompress);
console.log('newURN from pubKeyCompress:',newURN);

// RSA
console.log('Verify RSA:','e3ecf72fa4143b3416154b62d0b570609d13f080 ; 2f6b41e6091269af8782b0b3e62f00cadd9c724c4ed50fd1c5f04bb1ea45796d71192ea297b0b1c161ae619243eecaaf20794e0abc397705e357941435fcdbcf45b9dc955ae5a366eb4b991a947941f0a94e41b81c4c13453f0ca0230ba6063d7f79f437c2ea26db40d6eafaecf6df7565b6a7673b05d5c5ff6d9420c4acb72a8905f6f79e9026940ce9c8d38c96dbf5a0388d3965caea316456553fbf4818c12c213c88015eaf2930148d7b23a57a71994bdea5113f661a24b6fe74d6fd347d41a0c63638be28f8410d4c1cd441fc38b5a0d4bbee1410babe5b4e5768a55f1f321354acecaf9e14981434bbe1c72fcfb0153b94141f6c48198f3890f95e8ce3 ; pbk:rsa:2048:cb47e6aada931986bb6bbf02c8618437c072cefa4e19c1ee6cb189b95a49e3ce94fb4de129c30ab7e683f827c98eb05e844af24f809ed5f217e93c14d58f64b98fc9136d3c2b56a672853a8f52c7ac7acd201b09d0f578f32f377f954905e18fa360448901d0ac538cd1102dc0821cd13a843e370471c00e95daf4bba001186c5b2220e15f2f4777aa9b0a823186c34d82fd557e245b4d5816f48bdc09dd34806982609b63012dd13fe603f23730940e68463b1b68f24ee77907925d286d55ec22bad53119f8354388e051854ef436589538f1efbf104af477dc3ca2cf29974fcf432639b8716c38c717d44c8f0c90d59f02f2ab0aef8b59c2feb460e2cbfb57010001');
var urn = 'pbk:rsa:2048:cb47e6aada931986bb6bbf02c8618437c072cefa4e19c1ee6cb189b95a49e3ce94fb4de129c30ab7e683f827c98eb05e844af24f809ed5f217e93c14d58f64b98fc9136d3c2b56a672853a8f52c7ac7acd201b09d0f578f32f377f954905e18fa360448901d0ac538cd1102dc0821cd13a843e370471c00e95daf4bba001186c5b2220e15f2f4777aa9b0a823186c34d82fd557e245b4d5816f48bdc09dd34806982609b63012dd13fe603f23730940e68463b1b68f24ee77907925d286d55ec22bad53119f8354388e051854ef436589538f1efbf104af477dc3ca2cf29974fcf432639b8716c38c717d44c8f0c90d59f02f2ab0aef8b59c2feb460e2cbfb57010001';
var urnWithoutExponent = urn.slice(0, -6);
var challenge = 'e3ecf72fa4143b3416154b62d0b570609d13f080';
var wrongChallenge = 'e3ecf72fa4143b3416154b62d0b570609d13f081';
var signature = '2f6b41e6091269af8782b0b3e62f00cadd9c724c4ed50fd1c5f04bb1ea45796d71192ea297b0b1c161ae619243eecaaf20794e0abc397705e357941435fcdbcf45b9dc955ae5a366eb4b991a947941f0a94e41b81c4c13453f0ca0230ba6063d7f79f437c2ea26db40d6eafaecf6df7565b6a7673b05d5c5ff6d9420c4acb72a8905f6f79e9026940ce9c8d38c96dbf5a0388d3965caea316456553fbf4818c12c213c88015eaf2930148d7b23a57a71994bdea5113f661a24b6fe74d6fd347d41a0c63638be28f8410d4c1cd441fc38b5a0d4bbee1410babe5b4e5768a55f1f321354acecaf9e14981434bbe1c72fcfb0153b94141f6c48198f3890f95e8ce3';

console.log('should be true:', utils.rsa.verify(urn, challenge, signature));
console.log('should be true:', utils.rsa.verify(urnWithoutExponent, challenge, signature));
console.log('should be false:', utils.rsa.verify(urn, wrongChallenge, signature));


// URN
console.log('should be true:', utils.urn.check(urn));
console.log('should be false:', utils.urn.check('pbk'));
console.log('should be false:', utils.urn.check('pbk:'));
console.log('should be false:', utils.urn.check('pbk::ec'));
console.log('should be false:', utils.urn.check(':pbk:ec'));
console.log('should be false:', utils.urn.check(':'));
console.log('should be false:', utils.urn.check(''));
console.log('should be false:', utils.urn.check('pbk:ec:secp256r11'));
console.log('should be false:', utils.urn.check('pbk:ec:secp256r1'));
console.log('should be false:', utils.urn.check('pbk:ec:secp256r1:something:id'));
console.log('should be false:', utils.urn.check('pbk:ec:secp256r2:123'));
console.log('should be false:', utils.urn.check('pbk:rsa:20480'));
console.log('should be false:', utils.urn.check('pbk:rsa:2048'));
console.log('should be false:', utils.urn.check('pbk:rsa:2048:something:id'));
console.log('should be false:', utils.urn.check('pbk:rsa:512'));
console.log('should be false:', utils.urn.check('ble:1.01'));
console.log('should be false:', utils.urn.check('ble:1.0'));
console.log('should be false:', utils.urn.check('ble:3.0'));
console.log('should be false:', utils.urn.check('ble:1.0:whatever:11223344'));
console.log('should be false:', utils.urn.check('nfc:1.01'));
console.log('should be false:', utils.urn.check('nfc:1.0'));
console.log('should be false:', utils.urn.check('nfc:1.0:something:id'));
console.log('should be false:', utils.urn.check('nfc:2.0'));
console.log('should be false:', utils.urn.check('snu:123'));
console.log('should be false:', utils.urn.check('sn:'));
console.log('should be false:', utils.urn.check('sn:something:id'));
console.log('should be false:', utils.urn.check('sn'));
console.log('should be true:', utils.urn.check('pbk:ec:secp256r1:123'));
console.log('should be true:', utils.urn.check('pbk:rsa:2048:123'));
console.log('should be true:', utils.urn.check('ble:1.0:123'));
console.log('should be true:', utils.urn.check('nfc:1.0:123'));
console.log('should be true:', utils.urn.check('sn:123'));
