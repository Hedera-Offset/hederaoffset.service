import { Client, TopicMessageSubmitTransaction, AccountId, PrivateKey } from "@hashgraph/sdk"


export async function hcs_submit_message(acc_id: string, acc_key: string, topic_id: string, event_msg: string): Promise<number> {
    
    console.log("running", topic_id)
    const account_id = AccountId.fromString(acc_id);
    const account_key = PrivateKey.fromStringECDSA(acc_key);

    const client = Client.forTestnet();
    client.setOperator(account_id, account_key);
    const sendsorData = '{"deviceId":38,"meter_type":"Sonoff","time":"2024-08-19T14:30:00Z","temprature":"32","totalEnergy":14,"today":10,"power":240,"apparentPower":208,"reactivePower":207,"factor":55,"voltage":120,"current":4,"raw":"null"}'
    // Send message to the topic
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topic_id,
        message: sendsorData,
    }).execute(client);
    
    // Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);
    // console.log(parseInt(getReceipt.topicSequenceNumber));
    // Get the status of the transaction
    const transactionStatus = getReceipt.status;
    // console.log("The message transaction status " + transactionStatus.toString());
    client.close();

    return parseInt(getReceipt.topicSequenceNumber);

}
