import {promptGenerator} from "./src/domains/ai/functions";
import {sendAIQuestion} from "./src/domains/ai/functions";
import {Constants} from "./constants";

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

