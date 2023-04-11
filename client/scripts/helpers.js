import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function hashMessage(msg) {
    const bytes = utf8ToBytes(msg);
    const hash = keccak256(bytes);
    return toHex(hash);
}

function getAddress(publicKey) {
    const hash = keccak256(publicKey.slice(1));
    const addr = hash.slice(-20);
    return addr;
}

function recoverKey(message, signature) {
    const msgHash = hashMessage(message);
    const pubKey = secp.recoverPublicKey(msgHash, signature[0], signature[1]);
    return pubKey;
}

async function signMessage(msg, privateKey) {
    const hash = hashMessage(msg);
    const signature = await secp.sign(hash, privateKey, {recovered: true});
    console.log(signature);
    signature[0] = toHex(signature[0]);
    return {sig: signature, msgH: hash};
}

function verifyIdentity(signature, msgHash, pubKey) { return secp.verify(signature, msgHash, pubKey); }

export {hashMessage, getAddress, recoverKey, verifyIdentity, signMessage};