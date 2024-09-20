// const { Client, PrivateKey, AccountCreateTransaction, Hbar } = require("@hashgraph/sdk");

import { AccountCreateTransaction, Client, Hbar, PrivateKey } from "@hashgraph/sdk";

export async function generateAccount(operatorAccountId: string, operatorPrivateKey: string): Promise<string[]> {

    const client = Client.forTestnet();
    client.setOperator(operatorAccountId, operatorPrivateKey);

    const newDeviceAccountKey = PrivateKey.generate();
    
    const transaction = new AccountCreateTransaction()
        .setKey(newDeviceAccountKey)
        .setInitialBalance(new Hbar(1));

    const txResponse = await transaction.execute(client);
    
    const receipt = await txResponse.getReceipt(client);
    const newDeviceAccountId = receipt.accountId;


    console.log(`New account created with ID: ${newDeviceAccountId}`);
    console.log(`New account private key: ${newDeviceAccountKey.toString()}`);
    return [newDeviceAccountId?.toString()!, newDeviceAccountKey.toStringRaw(),newDeviceAccountKey.publicKey.toStringRaw()];
}