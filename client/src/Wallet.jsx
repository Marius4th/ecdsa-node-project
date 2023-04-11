import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import React, { useState } from "react";
import Transfer from "./Transfer";
import { signMessage, getAddress } from "../scripts/helpers.js";

/*
Test keys:
7b9bd499a5ce06310637c3e000afe140db712b6740e2230be07af6821c77a0ab
d84038a3ba78422087214d28b33db9ce0ef7d4ae8db5b199579f4b4793fa6fb4
66f7d1d42f3ac4a461cc42b13d9f55e22c66312f9f780550bc2c3fb3d409f136
*/

// Data in the wallet mustn't be exposed outside (must stay in the client's machine)
class Wallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      privateKey: "",
      address: "",
      balance: 0,
    }

    this.onPrvKeyChange = this.onPrvKeyChange.bind(this);
    this.setBalance = this.setBalance.bind(this);
  }

  setBalance(balance) {
    this.setState({
      balance: balance
    });
  }

  async onPrvKeyChange(evt) {
    const privateKey = evt.target.value;
    let address = "";

    // Key must be 64 characters long
    if (privateKey.length === 64) {
      const publicKey = secp.getPublicKey(privateKey);
      address = toHex(getAddress(publicKey));

      // Retrieve balance
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        this.setBalance(balance);
      } 
      else {
        this.setBalance(0);
      }
    }
    else this.setBalance(0);

    this.setState({
      privateKey: privateKey,
      address: address,
    });
  }

  render() {
    return (
      <div id="wallet-root">
        <div className="container wallet">
          <h1>Your Wallet</h1>
          <label>
            Private Key
            <input placeholder="Type your private key (don't share with anyone)" value={this.state.privateKey} onChange={this.onPrvKeyChange}></input>
          </label>
          <label>
            Info
            <div className="info">
              <p>Address: {this.state.address}</p>
              <p>Balance: {this.state.balance}</p>
            </div>
          </label>
        </div>
        <Transfer setBalance={this.setBalance} address={this.state.address} signMessage={(msg) => signMessage(msg, this.state.privateKey)} />
      </div>
    );
  }
};

export default Wallet;
