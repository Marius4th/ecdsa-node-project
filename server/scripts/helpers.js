const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function hashMessage(msg) {
    const bytes = utf8ToBytes(msg);
    const hash = keccak256(bytes);
    return toHex(hash);
}

function getAddress(publicKey) {
    const hash = keccak256(publicKey.slice(1));
    const addr = hash.slice(-20);
    return toHex(addr);
}

function recoverKey(hashedMessage, signature) {
    const pubKey = secp.recoverPublicKey(hashedMessage, signature[0], signature[1], false);
    return pubKey;
}

function verifyIdentity(signature, hashedMessage, pubKey) { return secp.verify(signature, hashedMessage, pubKey); }

module.exports = {hashMessage, getAddress, recoverKey, verifyIdentity};