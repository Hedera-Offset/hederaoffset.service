import { TokenResponse } from "../../types/hedera";


// get all carbon tokens owned by an accound id
export async function getAllNfts(tokenId: string, accountId: string): Promise<TokenResponse[]> {

    const resp = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${tokenId}/nfts?token.id=${accountId}`,{
        method: "GET"
    })

    const jsn: TokenResponse[] = await resp.json();
    
    return jsn

}