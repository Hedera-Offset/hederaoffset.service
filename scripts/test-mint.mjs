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
import dotenv from "dotenv";
// const pinataSDK = require('@pinata/sdk');
import PinataClient from "@pinata/sdk"
import { createHash } from "crypto";

dotenv.config();
const pinata = new PinataClient({ pinataApiKey: process.env.PINATA_API, pinataSecretApiKey: process.env.PINATA_SECRET });
const tokenid = "0.0.4688268"

async function main() {
  if (!process.env.ACCOUNT_ID || !process.env.ACCOUNT_PRIVATE_KEY) {
    throw new Error("Please set required keys in .env file.");
  }
  const accountId = AccountId.fromString(process.env.ACCOUNT_ID);

  const accountKey = PrivateKey.fromStringECDSA(
    process.env.ACCOUNT_PRIVATE_KEY
  );

  const accountId2 = AccountId.fromString(process.env.ACCOUNT2_ID);
  const account2Key = PrivateKey.fromStringECDSA(
    process.env.ACCOUNT2_PRIVATE_KEY
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
  const res = await pinata.pinJSONToIPFS(metadata, {pinataMetadata: {name:filename}});

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
  console.log(nftMintTxReceipt.accountId,nftMintTxReceipt.fileId,nftMintTxReceipt.tokenId);

  // get total token supply 
  const tokeninfo = await new TokenInfoQuery().setTokenId(tokenid).execute(client);

  console.log(`${tokeninfo.totalSupply}`);
  
  // associate account2 with this NFT

  // await associate_account(accountId2, account2Key, client);

  // // transfer
  await transfer_to(accountId2,accountId,accountKey,client,tokeninfo.totalSupply-1);



  client.close();
}

async function associate_account(accountId, accountKey, client) {
  // let associateTx = await new AccountUpdateTransaction().setAccountId(accountId).freezeWith(client).sign(accountKey);
  // let associateTxSubmit = await associateTx.execute(client);
  // let associateRx = await associateTxSubmit.getReceipt(client);
  // console.log(`\n- Alice NFT auto-association: ${associateRx.status}`);
  // console.log(`- See: https://hashscan.io/testnet/transaction/${associateTxSubmit.transactionId}`);

  let associateBobTx = await new TokenAssociateTransaction().setAccountId(accountId).setTokenIds([tokenid]).freezeWith(client).sign(accountKey);
  let associateBobTxSubmit = await associateBobTx.execute(client);
  let associateBobRx = await associateBobTxSubmit.getReceipt(client);
  console.log(`\n- Bob NFT manual association: ${associateBobRx.status}`);
  console.log(`- See: https://hashscan.io/test/transaction/${associateBobTxSubmit.transactionId}`);
}

async function transfer_to(toId, treasuryId, treasuryKey, client, tokenNumber) {
  // 1st TRANSFER NFT Treasury -> Alice
  let tokenTransferTx = await new TransferTransaction().addNftTransfer(tokenid, tokenNumber, treasuryId, toId).freezeWith(client).sign(treasuryKey);
  let tokenTransferSubmit = await tokenTransferTx.execute(client);
  let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
  console.log(`\n- NFT transfer Treasury -> Alice status: ${tokenTransferRx.status}`);
  console.log(`- See: https://hashscan.io/testnet/transaction/${tokenTransferSubmit.transactionId}`);
}

main();

export default main;
