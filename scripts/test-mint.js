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
  const supplyKey = PrivateKey.generateED25519();
  const client = Client.forTestnet().setOperator(accountId, accountKey);
  const cid = new TextEncoder().encode(
    "ipfs://QmVtvHUCbVdRpmg5YFtfaYuX5LtYgWhAGpoBG3tDTpyC58"
  );

  // Mint token
  const nftMintTx = new TokenMintTransaction()
    .setMetadata([cid, cid])
    .setMaxTransactionFee(new Hbar(0.9))
    .setTokenId(tokenId)
    .freezeWith(client);

  const nftMintTxResponse = await (
    await nftMintTx.sign(supplyKey)
  ).execute(client);

  const nftMintTxReceipt = await nftMintTxResponse.getReceipt(client);
  console.log(
    `Status of NFT mint transction: ${nftMintTxReceipt.status.toString()}`
  );

  client.close();
}

main();

export default main;
