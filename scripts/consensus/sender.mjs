import { TopicCreateTransaction, Client, TopicMessageQuery, TopicMessageSubmitTransaction, AccountId, PrivateKey } from "@hashgraph/sdk"


const account_id = AccountId.fromString('0.0.4668512');
const account_key = PrivateKey.fromStringECDSA("0xe7d15d81eee06f87ae246ba530c9324cfabbf33e66747ff8c86bfd974132c8fd")
const topicId = '0.0.4887353';

const client = Client.forTestnet();
client.setOperator(account_id, account_key);
const sendsorData = '{"deviceId":38,"meter_type":"Sonoff","time":"2024-08-19T14:30:00Z","temprature":"32","totalEnergy":14,"today":10,"power":240,"apparentPower":208,"reactivePower":207,"factor":55,"voltage":120,"current":4,"raw":"null"}'


async function createTopic() {
    // Create a new topic
    let txResponse = await new TopicCreateTransaction().execute(client);

    // Grab the newly generated topic ID
    let receipt = await txResponse.getReceipt(client);
    let topicId = receipt.topicId;
    console.log(`Your topic ID is: ${topicId}`);

    // Wait 5 seconds between consensus topic creation and subscription creation
    await new Promise((resolve) => setTimeout(resolve, 5000));
    client.close()

}

async function subscribeTopic() {

    // Subscribe to the topic
    const topic = new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(client, null, (message) => {
            let messageAsString = Buffer.from(message.contents, "utf8").toString();
            console.log(
                `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
            );
        });

    client.close()

}

async function submitMessage() {
    // Send message to the topic
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: sendsorData,
    }).execute(client);
    
    // Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);
    console.log(parseInt(getReceipt.topicSequenceNumber))
    // Get the status of the transaction
    const transactionStatus = getReceipt.status
    console.log("The message transaction status " + transactionStatus.toString())
    client.close()

}


// createTopic();
// subscribeTopic();
submitMessage();