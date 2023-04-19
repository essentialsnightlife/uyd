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
import { AWS_REGION } from "../../../fe/src/constants";

const dbClient = new DynamoDBClient({ region: AWS_REGION });
const TableName = process.env.TABLE_NAME;

export async function create(event) {
  let body;
  try {
    // (via app) If the body is JSON, parse it
    body = JSON.parse(event.body);
    console.log("JSON Parsed Body");
  }
  catch (err) {
    // (via serverless framework) If the body is not JSON, it is a string
    body = event.body;
    console.log("Event Body");
  }

  const newAnalysedDream = {
    date: { S: body.date },
    id: { S: body.id },
    userId: { S: body.userId },
    query: { S: body.query },
    response: { S: body.response },
  };

  const params: PutItemCommandInput = {
    TableName: TableName,
    Item: newAnalysedDream,
  };

  try {
    await dbClient.send(new PutItemCommand(params));

    return JSON.stringify({ statusCode: 200, body });
  } catch (err) {
    console.log("Error: ", err);

    return JSON.stringify({
      body: { error: err.message },
      input: event,
    });
  }
}
export async function get(event) {
  const params: GetItemCommandInput = {
    TableName: TableName,
    Key: marshall({
      id: event.pathParameters.id,
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
