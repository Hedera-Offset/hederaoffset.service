import { AccountCreateTransaction, AccountId, Client, Hbar, PrivateKey, TokenAssociateTransaction } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();


export async function generateAccount(operatorAccountId, operatorPrivateKey) {

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
    client.close()
    return [newAccountId.toString(), newDeviceAccountKey.toStringDer(), newDeviceAccountKey.publicKey.toStringDer()];

}

async function test() {

    const accountId = AccountId.fromString(account_id);

    const accountKey = PrivateKey.fromStringECDSA(
        account_key
    );

    const accountId2 = AccountId.fromString(device_id);
    const account2Key = PrivateKey.fromStringED25519(
        device_key
    );

    const client = Client.forTestnet().setOperator(accountId, accountKey);


    // associate account2 with this NFT
    let associateBobTx = await new TokenAssociateTransaction().setAccountId(accountId2).setTokenIds([tokenid]).freezeWith(client).sign(account2Key);
    let associateBobTxSubmit = await associateBobTx.execute(client);
    let associateBobRx = await associateBobTxSubmit.getReceipt(client);
    console.log(`\n- Bob NFT manual association: ${associateBobRx.status}`);
    console.log(`- See: https://hashscan.io/test/transaction/${associateBobTxSubmit.transactionId}`);

}

// console.log(await generateAccount(process.env.ACCOUNT_ID ,process.env.ACCOUNT_PRIVATE_KEY))
await test();