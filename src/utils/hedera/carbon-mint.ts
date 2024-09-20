import {
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenType,
    TokenSupplyType,
    PrivateKey,
    Client,
    AccountId,
    Hbar,
    AccountUpdateTransaction,
    TransferTransaction,
    TokenAssociateTransaction,
    TokenInfoQuery,
} from "@hashgraph/sdk";
import PinataClient from "@pinata/sdk";
// const pinataSDK = require('@pinata/sdk');
import { createHash } from "crypto";

export async function mint(
    pinata: PinataClient,
    tokenid: string, 
    account_id: string, 
    account_key: string, 
    device_id: string, 
    device_key: string

) {

    const accountId = AccountId.fromString(account_id);

    const accountKey = PrivateKey.fromStringECDSA(
        account_key
    );

    const accountId2 = AccountId.fromString(device_id);
    const account2Key = PrivateKey.fromStringDer(
        device_key
    );

    // console.log(accountId,accountKey)
    const client = Client.forTestnet().setOperator(accountId, accountKey);


    // create token metadata on IPFS
    let metadata = {
        "name": "HederaOffset-Carbon",
        "image": "https://s2.coinmarketcap.com/static/img/coins/200x200/502.png",
        "type": "image/jpg",
        "description": "Carbon token standart for Hedera Offset carbon market",
        "properties": {
            "provider": "hedera offset",
            "machine_cid": "03B8B49C9A616115BCFC17CD33B535909922B03C1C0A7DEC97C0C3FBC0A21BF10C",
            "machine_address": "plmnt10f9rmpaded47gumjcfwkswyyalw4qx6yf39nxu",
            "cid": "bafkreicezvdkqbdfhz7sf336nwve2bw56yqqj5t4eadbnqlctrwtmjmuly",
            "location": "MH",
            "timestamp": "2024-06-06T12:22:44",
            "energy": 1
        },
        "files": [
            {
                "uri": "https://www.decantalo.com/product/images/4k-petrus.jpg",
                "type": "image/jpg",
                "is_default_file": true
            }
        ]
    }

    const filename = createHash('sha256').update(JSON.stringify(metadata)).digest('hex');
    const res = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: filename } });

    const cid = new TextEncoder().encode(
        `ipfs://${res.IpfsHash}`
    );

    // Mint token
    const nftMintTx = new TokenMintTransaction()
        .setTokenId(tokenid)
        .setMetadata([cid])
        .setMaxTransactionFee(new Hbar(0.9))
        .freezeWith(client);

    const nftSign = await nftMintTx.sign(accountKey);
    const nftMintTxResponse = await nftSign.execute(client);

    const nftMintTxReceipt = await nftMintTxResponse.getReceipt(client);
    console.log(
        `Status of NFT mint transction: ${nftMintTxReceipt.status.toString()} ${nftMintTxReceipt.tokenId}`
    );
    console.log(`- See: https://hashscan.io/testnet/transaction/${nftMintTxResponse.transactionId}`);
    console.log(nftMintTxReceipt.accountId, nftMintTxReceipt.fileId, nftMintTxReceipt.tokenId);

    // get total token supply 
    const tokeninfo = await new TokenInfoQuery().setTokenId(tokenid).execute(client);

    console.log(`${tokeninfo.totalSupply}`);

    try {
        // associate account2 with this NFT
        let associateBobTx = await new TokenAssociateTransaction().setAccountId(accountId2).setTokenIds([tokenid]).freezeWith(client).sign(account2Key);
        let associateBobTxSubmit = await associateBobTx.execute(client);
        let associateBobRx = await associateBobTxSubmit.getReceipt(client);
        console.log(`\n- Bob NFT manual association: ${associateBobRx.status}`);
        console.log(`- See: https://hashscan.io/test/transaction/${associateBobTxSubmit.transactionId}`);
    } catch {
        console.log("Token already associated skipping")
    }

    // // transfer
    let tokenTransferTx = await new TransferTransaction().addNftTransfer(tokenid, tokeninfo.totalSupply, accountId, accountId2).freezeWith(client).sign(accountKey);
    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
    console.log(`\n- NFT transfer Treasury -> Alice status: ${tokenTransferRx.status}`);
    console.log(`- See: https://hashscan.io/testnet/transaction/${tokenTransferSubmit.transactionId}`);


    client.close();
}