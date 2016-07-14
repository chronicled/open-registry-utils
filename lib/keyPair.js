// var ecurve = require('ecurve');
// var BigInteger = require('bigi');
// var Crypto = require('ezcrypto').Crypto;
// var getRandomValues = require('get-random-values');

var r = require('jsrsasign');

module.exports = {

    generate: function(){
        var curve = new r.ECDSA({'curve': 'secp256r1'});
        var pair = curve.generateKeyPairHex();
        pair.pub64 = new Buffer(pair.ecpubhex).toString('base64');
        return (pair);

        /*

        OLD CODE

        // Run in console here http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript

        //found in bitcoinjs-lib/src/jsbn/sec.js
        var curve = ecurve.getCurveByName("secp256r1");
        //create a typed array of 32 bytes (256 bits)
        var randArr = new Uint8Array(32);
        //populate array with cryptographically secure random numbers
        getRandomValues(randArr);
        //some Bitcoin and Crypto methods don't like Uint8Array for input. They expect regular JS arrays.
        var privateKeyBytes = [];
        for (var i = 0; i < randArr.length; ++i)
            privateKeyBytes[i] = randArr[i];
        //hex string of our private key
        //var privateKeyHex = Crypto.util.bytesToHex(privateKeyBytes);
        var privateKeyHex = "2a80378fdff6d5e89e06844c376bf27540089a8ddee51cd0b9eb3c15f7c9f40f";
        //convert our random array or private key to a Big Integer
        var privateKeyBN = BigInteger.fromHex(privateKeyHex);
        var curvePt = curve.G.multiply(privateKeyBN);
        var xHex = curvePt.x.toHex();
        var yHex = curvePt.y.toHex();
        var publicKeyHex = '04'+xHex+yHex;
        console.log("Prv: " + privateKeyHex);
        console.log("Pub:");
        console.log("X Hex = " + xHex);
        console.log("Y Hex = " + yHex);
        console.log("Pub key Hex = " + publicKeyHex);
        console.log("------------------------------------------------");*/
    }

}
