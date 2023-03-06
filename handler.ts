import { promptGenerator } from "./src/domains/ai/functions";
import { sendAIQuestion } from "./src/domains/ai/functions";
import { Constants } from "./constants";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const modelConfig = Constants.OPENAI_MODEL_CONFIG;

export async function analyser(event) {
  const prompt = promptGenerator(event.queryStringParameters.question);

  if (!(event.queryStringParameters || event.queryStringParameters.question)) {
    return {
      message: { result: "No question provided" },
      input: event,
    };
  }

  try {
    const completionText = await sendAIQuestion({
      model: modelConfig.model,
      prompt: prompt,
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.max_tokens,
    });

    return {
      body: { result: completionText },
      input: event,
    };
  } catch (error) {
    console.log(error);

    return {
      body: { error: error.message },
      input: event,
    };
  }
}

const dbClient = new DynamoDBClient({ region: "eu-west-2" });
const TableName = process.env.TABLE_NAME;
export async function createBotResponse(event) {
  const newBotResponse = {
    id: { S: event.body.id },
    userId: { S: event.body.userId },
    query: { N: event.body.query },
    response: { S: event.body.response },
  };

  try {
    await dbClient.send(
      new PutItemCommand({
        TableName: TableName,
        Item: newBotResponse,
      })
    );

    return { statusCode: 200, body: JSON.stringify(newBotResponse) };
  } catch (error) {
    console.log(error);

    return {
      body: { error: error.message },
      input: event,
    };
  }
}
