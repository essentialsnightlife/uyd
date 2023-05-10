import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    ScanCommand,
    DeleteItemCommand,
    DeleteItemCommandInput, ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { AWS_REGION } from "../../../fe/src/constants";

const dbClient = new DynamoDBClient({ region: AWS_REGION });
const TableName = process.env.TABLE_NAME;

export async function save(event) {
    console.log('event', event);
    console.log('Object.keys(event) ', Object.keys(event));

    let {id, userId, query, response, date} = event; // for local testing
    if(event.Records) {
        let {id, userId, query, response, date} = JSON.parse(event.Records[0].Sns.Message);
    }

    const newAnalysedDream = {
        id: { S: id },
        userId: { S: userId },
        query: { S: query },
        response: { S: response },
        date: { S: date },
    };
    console.log('newAnalysedDream: ', newAnalysedDream);

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

        return {statusCode: 200, newAnalysedDream};
    } catch (err) {
        console.log("Error: ", err);

        return JSON.stringify({
            body: {error: err.message},
            input: event,
        });
    }
}

const formatterDDBScan = (data: {}) => {
    const formattedData = {};
    Object.keys(data).forEach(key => {
        const value = data[key].S;
        formattedData[key] = value;
    });
    return formattedData;
}

export async function getUserAnalysedDreams(event) {
    const userId = event.pathParameters?.userId || event.body?.userId || ''

    const params: ScanCommandInput = {
        TableName: TableName,
        FilterExpression: "userId = :userId AND id <> :id",
        ExpressionAttributeValues: {
            ":userId": {S: userId},
            ":id": {S: '0'},
        }
    }

    try {

        const results = await dbClient.send(new ScanCommand(params));
        console.log(results);
        const formattedResultItems = results.Items.map(item => formatterDDBScan(item));
        console.log(formattedResultItems);

        return JSON.stringify({statusCode: 200, userId, responses: formattedResultItems });
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
    Key:  { id: { S: idToBeDeleted } },
  };

  try {
    const results = await dbClient.send(new DeleteItemCommand(params));

    return { statusCode: 200, deleted: idToBeDeleted,  body: JSON.stringify(results) };

  } catch (err) {
    console.log("Error: ", err);
    return {
      error: err.message ,
    };
  }
}
