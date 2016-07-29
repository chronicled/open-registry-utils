var utils = require('./index.js');

// Example keys.
// Todo: generate keys dynamically

// X, Y
var keys = [
  ['08e07141e07e622242f954dc89b656597a23a4dd3d212987c8cc0d827deccf7b', '704e94fb02bf21f54f622a9cdcb6a34981b91735d8227120a11c1b7eee983c51'],
  ['0b6a054d8270713c90f8b2bffe82430ed3e9dcc3ba85dd578f8de78acecdcb40', 'd0421fbf709d2678be6388290027c61d37d7845deb13ac96c6ec872c36236241'],
  ['644c762399ba9fcf2d8e144102cbbe94f2f034a3150846c3a09d7e146ff93559', '7f7ec2aab87182cf27f1d401b73c88578618e624eec99c5019e25f2f5b5acc90'],
]

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

var newKeyPair = utils.keyPair.generate('secp256r1');
console.log('newKeyPair:',newKeyPair);

var pubKeyCompress = utils.ec.compress(newKeyPair.ecpubhex);
console.log('pubKeyCompress:',pubKeyCompress);

var newURN = utils.urn.create('pbk',['ec','secp256r1'],pubKeyCompress);
console.log('newURN:',newURN);
