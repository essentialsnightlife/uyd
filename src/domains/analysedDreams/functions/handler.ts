import { DynamoDBClient, PutItemCommand, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dbClient = new DynamoDBClient({ region: "eu-west-2" });
const TableName = process.env.TABLE_NAME;
export async function create(event) {
    const newAnalysedDream = {
        id: { S: event.body.id },
        userId: { S: event.body.userId },
        query: { S: event.body.query },
        response: { S: event.body.response },
    };

    try {
        await dbClient.send(
            new PutItemCommand({
                TableName: TableName,
                Item: newAnalysedDream,
            })
        );

        return { statusCode: 200, body: JSON.stringify(newAnalysedDream) };
    } catch (error) {
        console.log(error);

        return {
            body: { error: error.message },
            input: event,
        };
    }
}
export async function get(event) {

    const params: GetItemCommandInput = {
        TableName: TableName,
        Key: marshall({
            id: event.queryStringParameters.id,
        }),
    };

    try {
        const results = await dbClient.send(new GetItemCommand(params));
        console.log(results)

        return { statusCode: 200, body: JSON.stringify(unmarshall(results.Item)) };
    } catch (error) {
        console.log(error);

        return {
            body: { error: error.message },
            input: event,
        };
    }
}