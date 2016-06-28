// Run in console here http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript 

function generateKeyPair() {
   var curve = getSECCurveByName("secp256r1") //found in bitcoinjs-lib/src/jsbn/sec.js

   var randArr = new Uint8Array(32) //create a typed array of 32 bytes (256 bits)
   window.crypto.getRandomValues(randArr) //populate array with cryptographically secure random numbers

   //some Bitcoin and Crypto methods don't like Uint8Array for input. They expect regular JS arrays.
   var privateKeyBytes = []
   for (var i = 0; i < randArr.length; ++i)
     privateKeyBytes[i] = randArr[i]

   //hex string of our private key
   var privateKeyHex = Crypto.util.bytesToHex(privateKeyBytes).toUpperCase()

   //convert our random array or private key to a Big Integer
   var privateKeyBN = BigInteger.fromByteArrayUnsigned(privateKeyBytes)

   var curvePt = curve.getG().multiply(privateKeyBN)
   var x = curvePt.getX().toBigInteger()
   var y = curvePt.getY().toBigInteger()
   var xHex = Crypto.util.bytesToHex( integerToBytes(x, 32) )
   var yHex = Crypto.util.bytesToHex( integerToBytes(y, 32) )

   console.log("Prv: " + privateKeyHex)
   console.log("Pub: \n")
   console.log("X = " + xHex + " \n")
   console.log("Y = " + yHex + " \n")
 }
