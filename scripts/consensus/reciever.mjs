import { TopicCreateTransaction, Client, TopicMessageQuery, TopicMessageSubmitTransaction, AccountId, PrivateKey } from "@hashgraph/sdk"


const account_id = AccountId.fromString('0.0.4668512');
const account_key = PrivateKey.fromStringECDSA("0xe7d15d81eee06f87ae246ba530c9324cfabbf33e66747ff8c86bfd974132c8fd")
const topicId = '0.0.4887353';

const client = Client.forTestnet();
client.setOperator(account_id, account_key);


async function subscribeTopic() {

    // Subscribe to the topic
    const topic = new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(client, null, (message) => {
            console.log(message)
            let messageAsString = Buffer.from(message.contents, "utf8").toString();
            console.log(
                `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
            );
        });

}



subscribeTopic();
