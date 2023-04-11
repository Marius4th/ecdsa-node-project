const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);
const addr = keccak256(publicKey.slice(1)).slice(-20);

console.log("pvkey: ", toHex(privateKey));
console.log("ppkey: ", toHex(publicKey));
console.log("addr: ", toHex(addr));