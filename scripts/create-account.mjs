import { AccountBalanceQuery, AccountCreateTransaction, AccountId, Client, Hbar, NftId, PrivateKey, TokenAssociateTransaction, TokenId, TokenNftInfoQuery } from "@hashgraph/sdk";
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

    let tokenid = '0.0.4688268';
    const account_id = '0.0.4668512'
    const account_key = "0xe7d15d81eee06f87ae246ba530c9324cfabbf33e66747ff8c86bfd974132c8fd"
    const device_id = "0.0.4691085"
    const device_key = "b0d409f88533a65748b98c5eda3fd4a3054c43d39fb2e58db1ccbf1f8a14ce41"
    const token = TokenId.fromString(tokenid);

    const accountId = AccountId.fromString(account_id);

    const accountKey = PrivateKey.fromStringECDSA(
        account_key
    );

    const accountId2 = AccountId.fromString(device_id);
    // const account2Key = PrivateKey.fromStringED25519(
    //     device_key
    // );

    const client = Client.forTestnet().setOperator(accountId, accountKey);


    // associate account2 with this NFT
    // let associateBobTx = await new TokenAssociateTransaction().setAccountId(accountId2).setTokenIds([tokenid]).freezeWith(client).sign(account2Key);
    // let associateBobTxSubmit = await associateBobTx.execute(client);
    // let associateBobRx = await associateBobTxSubmit.getReceipt(client);
    // console.log(`\n- Bob NFT manual association: ${associateBobRx.status}`);
    // console.log(`- See: https://hashscan.io/test/transaction/${associateBobTxSubmit.transactionId}`);

    const balance = await new AccountBalanceQuery()
        .setAccountId(accountId2)
        .execute(client);
    const tokenBalance = balance.tokens.get(token);
    console.log(tokenBalance)

    const nftInfos = await new TokenNftInfoQuery()
     .setTokenId(token)
     .setAccountId(accountId)
     .execute(client);

     console.log(nftInfos)

    // const nfts = [];
    //     for (let serialNumber = 1; serialNumber <= tokenBalance; serialNumber++) {
    //         const nftInfo = await new TokenNftInfoQuery()
    //             .setNftId(serialNumber)
    //             .execute(client);

    //         // if (nftInfo.accountId.equals(accountId)) {
    //         //     nfts.push(nftInfo);
    //         // }
    //     }

    client.close()

}

// console.log(await generateAccount(process.env.ACCOUNT_ID ,process.env.ACCOUNT_PRIVATE_KEY))
await test();