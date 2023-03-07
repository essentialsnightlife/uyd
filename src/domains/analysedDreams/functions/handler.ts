import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  ScanCommand,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Constants } from "../../../../constants";

import AWS_REGION = Constants.AWS_REGION;
const dbClient = new DynamoDBClient({ region: AWS_REGION });
const TableName = process.env.TABLE_NAME;
export async function create(event) {
  const newAnalysedDream = {
    id: { S: event.body.id },
    userId: { S: event.body.userId },
    query: { S: event.body.query },
    response: { S: event.body.response },
  };

  const params: PutItemCommandInput = {
    TableName: TableName,
    Item: newAnalysedDream,
  };

  try {
    await dbClient.send(new PutItemCommand(params));

    return { statusCode: 200, body: JSON.stringify(newAnalysedDream) };
  } catch (err) {
    console.log("Error: ", err);

    return {
      body: { error: err.message },
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
    console.log(results);

    return { statusCode: 200, body: JSON.stringify(unmarshall(results.Item)) };
  } catch (err) {
    console.log("Error: ", err);

    return {
      body: { error: err.message },
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
