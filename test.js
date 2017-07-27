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

const utils = require('./index.js');
const should = require('should');

describe("EC Utils: ", () => {
  // Example keys.
  // Todo: generate keys dynamically
  const XYkeys = [
    ['08e07141e07e622242f954dc89b656597a23a4dd3d212987c8cc0d827deccf7b', '704e94fb02bf21f54f622a9cdcb6a34981b91735d8227120a11c1b7eee983c51'],
    ['0b6a054d8270713c90f8b2bffe82430ed3e9dcc3ba85dd578f8de78acecdcb40', 'd0421fbf709d2678be6388290027c61d37d7845deb13ac96c6ec872c36236241'],
    ['644c762399ba9fcf2d8e144102cbbe94f2f034a3150846c3a09d7e146ff93559', '7f7ec2aab87182cf27f1d401b73c88578618e624eec99c5019e25f2f5b5acc90'],
  ]
  it("should correctly derive the Y coordinate from the X coordinate", () => {
    XYkeys.map(keys => {
      const [xKey, yKey] = keys;
      // console.log(ec.getYbyX(key[0]), ec.hexToBigInteger(key[1]).isEven() );
      should(utils.ec.getYbyX(xKey, utils.ec.hexToBigInteger(yKey).isEven())).equal(yKey.toUpperCase());
    } )
  })
  it("should correctly compress and decompress coordinates", () => {
    XYkeys.map(key => {
      const uncompressed = '04' + key[0] + key[1];
      should(utils.ec.decompressToCoordinate(utils.ec.compressCoordinate(key[0], key[1])).y).equal(key[1].toUpperCase());
      should(utils.ec.decompress(utils.ec.compress(uncompressed)).toLowerCase()).equal(uncompressed.toLowerCase());
    });
  });

  it("should verify a given ec public key, challenge, and signature", () => {
    const compressed = 'pbk:ec:secp256r1:0360FED4BA255A9D31C961EB74C6356D68C049B8923B61FA6CE669622E60F29FB6';
    const uncompressed = 'pbk:ec:secp256r1:0492b0a5466a6711eedcaa63692150631c781542d5958b56ab4a52a91f8455ac2cff37d1518c918255a305cf1b84894a547a1697153fc506e0af1e8357c039692a';
    should(utils.ec.verify(compressed, 'af2bdbe1aa9b6ec1e2ade1d694f41fc71a831d0268e9891562113d8a62add1bf','3046022100efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716022100f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8')).equal(true);
    should(utils.ec.verify(compressed, 'af2bdbe1aa9b6ec1e2ade1d694441fc71a831d0268e9891562113d8a62add1bf','3046022100efd48b2aacb6a8fd1140dd9cd45e81d69d2c877b56aaf991c34d0ea84eaf3716022100f7cb1c942d657c41d436c7a1b6e29f65f3e900dbb9aff4064dc4ab2f843acda8')).equal(false);
    should(utils.ec.verify(uncompressed, '2ed24287293442f80e70b48d80edc9e5417760461f2e22ec70fe034d72e1b589','3045022100e475420623be422cbb178ae49c2e358bdfd442a994f77bf8238c93b4c3dc6ee1022040dd414d8bbb1dc8aa07baa9c6c400762fa9acacdaf5ad095060dc62f4dc16c2')).equal(true);
  });

  it("should create a new urn from a valid ec public key", () => {
    const newKeyPair = utils.keyPair.generate('secp256r1');
    const pubKeyCompress = utils.ec.compress(newKeyPair.ecpubhex);
    const newURN = utils.urn.create('pbk',['ec','secp256r1'],pubKeyCompress);
    should(newURN).startWith('pbk:ec:secp256r1');
  });
});

describe("RSA Utils", () => {
  it("should verify RSA key, challenge, and signature", () => {
    const urn = 'pbk:rsa:2048:cb47e6aada931986bb6bbf02c8618437c072cefa4e19c1ee6cb189b95a49e3ce94fb4de129c30ab7e683f827c98eb05e844af24f809ed5f217e93c14d58f64b98fc9136d3c2b56a672853a8f52c7ac7acd201b09d0f578f32f377f954905e18fa360448901d0ac538cd1102dc0821cd13a843e370471c00e95daf4bba001186c5b2220e15f2f4777aa9b0a823186c34d82fd557e245b4d5816f48bdc09dd34806982609b63012dd13fe603f23730940e68463b1b68f24ee77907925d286d55ec22bad53119f8354388e051854ef436589538f1efbf104af477dc3ca2cf29974fcf432639b8716c38c717d44c8f0c90d59f02f2ab0aef8b59c2feb460e2cbfb57010001';
    const urnWithoutExponent = urn.slice(0, -6);
    const challenge = 'e3ecf72fa4143b3416154b62d0b570609d13f080';
    const wrongChallenge = 'e3ecf72fa4143b3416154b62d0b570609d13f081';
    const signature = '2f6b41e6091269af8782b0b3e62f00cadd9c724c4ed50fd1c5f04bb1ea45796d71192ea297b0b1c161ae619243eecaaf20794e0abc397705e357941435fcdbcf45b9dc955ae5a366eb4b991a947941f0a94e41b81c4c13453f0ca0230ba6063d7f79f437c2ea26db40d6eafaecf6df7565b6a7673b05d5c5ff6d9420c4acb72a8905f6f79e9026940ce9c8d38c96dbf5a0388d3965caea316456553fbf4818c12c213c88015eaf2930148d7b23a57a71994bdea5113f661a24b6fe74d6fd347d41a0c63638be28f8410d4c1cd441fc38b5a0d4bbee1410babe5b4e5768a55f1f321354acecaf9e14981434bbe1c72fcfb0153b94141f6c48198f3890f95e8ce3';
    should(utils.rsa.verify(urn, challenge, signature)).equal(true);
    should(utils.rsa.verify(urnWithoutExponent, challenge, signature)).equal(true);
    should(utils.rsa.verify(urn, wrongChallenge, signature)).equal(false);
  });
});

describe("URN Utils", () => {
  it("should return true for valid urns", () => {
    const urn = 'pbk:rsa:2048:cb47e6aada931986bb6bbf02c8618437c072cefa4e19c1ee6cb189b95a49e3ce94fb4de129c30ab7e683f827c98eb05e844af24f809ed5f217e93c14d58f64b98fc9136d3c2b56a672853a8f52c7ac7acd201b09d0f578f32f377f954905e18fa360448901d0ac538cd1102dc0821cd13a843e370471c00e95daf4bba001186c5b2220e15f2f4777aa9b0a823186c34d82fd557e245b4d5816f48bdc09dd34806982609b63012dd13fe603f23730940e68463b1b68f24ee77907925d286d55ec22bad53119f8354388e051854ef436589538f1efbf104af477dc3ca2cf29974fcf432639b8716c38c717d44c8f0c90d59f02f2ab0aef8b59c2feb460e2cbfb57010001';
    const urn2 = 'pbk:ec:secp256r1:0260fed4ba255a9d31c961eb74c6356d68c049b8923b61fa6ce669622e60f29fb6'
    should(utils.urn.check(urn)).equal(true);
    should(utils.urn.check(urn2)).equal(true);
  });

  it("should return a string message for invalid urns", () => {
    should(utils.urn.check('pbk')).be.String();
    // should(utils.urn.check('pbk:')).be.String();
    // should(utils.urn.check('pbk::ec')).be.String();
    // should(utils.urn.check(':pbk:ec')).be.String();
    // should(utils.urn.check(':')).be.String();
    // should(utils.urn.check('')).be.String();
    // should(utils.urn.check('pbk:ec:secp256r11')).be.String();
    // should(utils.urn.check('pbk:ec:secp256r1')).be.String();
    // should(utils.urn.check('pbk:ec:secp256r1:something:id')).be.String();
    // should(utils.urn.check('pbk:ec:secp256r2:123')).be.String();
    // should(utils.urn.check('pbk:rsa:20480')).be.String();
    // should(utils.urn.check('pbk:rsa:2048')).be.String();
    // should(utils.urn.check('pbk:rsa:2048:something:id')).be.String();
    // should(utils.urn.check('pbk:rsa:512')).be.String();
    // should(utils.urn.check('ble:1.01')).be.String();
    // should(utils.urn.check('ble:1.0')).be.String();
    // should(utils.urn.check('ble:3.0')).be.String();
    // should(utils.urn.check('ble:1.0:whatever:11223344')).be.String();
    // should(utils.urn.check('nfc:1.01')).be.String();
    // should(utils.urn.check('nfc:1.0')).be.String();
    // should(utils.urn.check('nfc:1.0:something:id')).be.String();
    // should(utils.urn.check('nfc:2.0')).be.String();
    // should(utils.urn.check('snu:123')).be.String();
    // should(utils.urn.check('sn:')).be.String();
    // should(utils.urn.check('sn:something:id')).be.String();
    // should(utils.urn.check('sn')).be.String();
    // should(utils.urn.check('pbk:rsa:2048:123')).be.String();
    // should(utils.urn.check('ble:1.0:123')).be.String();
    // should(utils.urn.check('nfc:1.0:123')).be.String();
    // should(utils.urn.check('sn:123')).be.String();
  });
});
