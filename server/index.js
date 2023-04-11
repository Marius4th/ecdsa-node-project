const { getAddress, verifyIdentity, recoverKey } = require("./scripts/helpers");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const { sign } = require("ethereum-cryptography/secp256k1");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "3ae915625ccc3cb9fa8caa084ebb15b364e15b3a": 100,
  "3ec7c0cd9d29162b510a5f358daf4568b1106f29": 50,
  "cd6b721a7dac6b2d11b59be4347f4e411f7162f2": 75,
};

const publicKeys = {
  "3ae915625ccc3cb9fa8caa084ebb15b364e15b3a": "04fd7b269f83ec441121f2f0cb9656b35ff8351acd192c2fb8b924714c473e88bb56aec1484e30c53a87add7677d67c86c10c1886d773dc068193ad3cdc4b165c6",
  "3ec7c0cd9d29162b510a5f358daf4568b1106f29": "041c22869a2a40c1ffa7a5dad847f7c8affc822c172f0c71261bd1cde1530d3f4de9f0072cef4551628b7485672a81759fd535a31920e79180562fe30bb63af3cc",
  "cd6b721a7dac6b2d11b59be4347f4e411f7162f2": "04285bd36b89a064590f8e6df3fe63c6edb6457cda0ad1dd076ed09c584f80193da6b5958c8dc73427900f9c04bb8e83c058e056a2e26b04c33300160239dd10c7",
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, signature, hashedMessage, recipient, amount } = req.body;

  const publicKey = recoverKey(hashedMessage, signature);
  const senderAddr = getAddress(publicKey);
  const pk = publicKeys[sender];

  // Simple verification with signature and previously shared public key
  if (verifyIdentity(signature[0], hashedMessage, pk) && senderAddr === sender) {

    if (!balances[senderAddr] || balances[senderAddr] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } 
    else {
      // Init address with 0 balance if not found
      setInitialBalance(recipient);
      balances[senderAddr] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[senderAddr] });
    }
  }
  else res.status(400).send({ message: "Authentication failed!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
