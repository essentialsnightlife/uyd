import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    GetItemCommand,
    GetItemCommandInput,
    ScanCommand,
    DeleteItemCommand,
    DeleteItemCommandInput, BatchGetItemCommandInput, BatchGetItemCommand, ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AWS_REGION } from "../../../fe/src/constants";

const dbClient = new DynamoDBClient({ region: AWS_REGION });
const TableName = process.env.TABLE_NAME;

export async function save(event) {
  const { id, userId, query, response, date } =  JSON.parse(event.Records[0].Sns.Message);

  const newAnalysedDream = {
    id: { S: id },
    userId: { S: userId },
    query: { S: query },
    response: { S: response },
    date: { S: date },
  };

  //example new analysed dream
    // {
    //   id: 'UYD1630546800000',
    //   userId: '612f1b0a1c9d5b006a0f1b9e',
    //   query: 'I dreamt was eating the sandwich and then I woke up.',
    //   response: 'You are a very creative person.'
    //   date: '2021-09-01T00:00:00.000Z'
    // }

  const params: PutItemCommandInput = {
    TableName: TableName,
    Item: newAnalysedDream,
  };

  try {
    await dbClient.send(new PutItemCommand(params));

    return{ statusCode: 200, newAnalysedDream };
  } catch (err) {
    console.log("Error: ", err);

    return JSON.stringify({
      body: { error: err.message },
      input: event,
    });
  }
}

export async function getUserAnalysedDreams(event) {
    const params: ScanCommandInput = {
        TableName: TableName,
        FilterExpression: "userId = :userId AND id <> :id",
        ExpressionAttributeValues: {
            ":userId": {S: event.body.userId},
            ":id": {S: '0'},
        }
    }

    try {

        const results = await dbClient.send(new ScanCommand(params));
        console.log(results);

        return {statusCode: 200, userId: event.body.userId, responses: results.Items };
    } catch (err) {
        console.log("Error: ", err);

        return {
            body: {error: err.message},
            input: event,
        };
    }
}

export async function list() {
  try {
    const data = await dbClient.send(new ScanCommand({ TableName: TableName }));
    data.Items.forEach(function (element) {
      console.log(
        "id: " +
          element.id.S +
          " | userId: " +
          element.userId.S +
          " | query: " +
          element.query.S +
          " | response: " +
          element.response.S
      );
    });

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.log("Error: ", err);
    return {
      body: { error: err.message },
    };
  }
}
export async function del(event) {
  const idToBeDeleted = event.pathParameters.id;
  const params: DeleteItemCommandInput = {
    TableName: TableName,
    Key:  marshall({ id: { S: idToBeDeleted } }),
  };

  try {
    const results = await dbClient.send(new DeleteItemCommand(params));

    return { statusCode: 200, body: JSON.stringify(results) };

  } catch (err) {
    console.log("Error: ", err);
    return {
      body: { error: err.message },
    };
  }
}
