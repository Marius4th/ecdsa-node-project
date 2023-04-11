import React, { useState } from "react";
import server from "./server";
import { hashMessage, recoverKey } from "../scripts/helpers.js";

function Transfer({ address, setBalance, signMessage }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("Idle");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const {
      data: { balance },
    } = await server.get(`balance/${address}`);
    setBalance(balance);

    // Sign some random data
    const signatureData = await signMessage(balance.toString() + Date.now().toString());

    // Send trasaction order to server
    try {
      setStatus("Transaction Pending");

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        signature: signatureData.sig,
        hashedMessage: signatureData.msgH,
        amount: parseInt(sendAmount),
        recipient,
      });

      setBalance(balance);
      setStatus("Transaction Successful!");
    } 
    catch (ex) {
      setStatus("Transaction Error: " + ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 9fe4942181e89c9e3b8de48f4a782be101fbe812"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Status
        <div className="info"><p>{status}</p></div>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
