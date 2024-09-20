import { AccountCreateTransaction, Client, Hbar, PrivateKey } from "@hashgraph/sdk";

export async function generateAccount(operatorAccountId: string, operatorPrivateKey: string): Promise<string[]> {

    const client = Client.forTestnet();
    client.setOperator(operatorAccountId, operatorPrivateKey);

    const newDeviceAccountKey = PrivateKey.generateED25519();

    // Prepare the transaction
    let newAccount = new AccountCreateTransaction()
    .setKey(newDeviceAccountKey)
    .setInitialBalance(new Hbar(1))
    .freezeWith(client);
    
    let transaction = await newAccount.sign(PrivateKey.fromStringECDSA(operatorPrivateKey));
    
    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newAccountId = receipt.accountId;
    console.log("=======")

    return [newAccountId?.toString()!, newDeviceAccountKey.toStringRaw(), newDeviceAccountKey.publicKey.toStringRaw()];

}
