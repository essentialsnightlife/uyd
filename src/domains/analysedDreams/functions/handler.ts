import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

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