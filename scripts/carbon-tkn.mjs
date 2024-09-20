// Script to create Hedera Offset Carbon token

import {
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenType,
    TokenSupplyType,
    PrivateKey,
    Client,
    AccountId,
    Hbar,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

async function main() {
    dotenv.config();
    if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
        throw new Error("Please set required keys in .env file.");
    }

    const accountId = AccountId.fromString(process.env.ACCOUNT_ID);

    const accountKey = PrivateKey.fromStringECDSA(
        process.env.ACCOUNT_PRIVATE_KEY
    );
    console.log(accountKey);
    const client = Client.forTestnet().setOperator(accountId, accountKey);

    let nftCreateTx = new TokenCreateTransaction()
        .setTokenName("Hedera Offset Carbon")
        .setTokenSymbol("HOC1")
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTreasuryAccountId(accountId)
        .setSupplyKey(accountKey)
        // .setKycKey(supplyKey)
        .freezeWith(client);

    const nftCreateTxSigned = await nftCreateTx.sign(accountKey);
    const nftCreateTxResponse = await nftCreateTxSigned.execute(client);
    const nftCreateTxReceipt = await nftCreateTxResponse.getReceipt(client);
    console.log(
        `Status of NFT create transaction: ${nftCreateTxReceipt.status.toString()}`
    );
    const tokenId = nftCreateTxReceipt.tokenId;
    console.log(`Token id: ${tokenId.toString()}`);

    client.close();

}

main();

export default main;
