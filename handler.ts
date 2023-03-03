import { OpenAIApi } from "openai";
import {config, model} from "./src/domains/ai/config";
import {promptGenerator} from "./src/domains/ai/functions";

const openai = new OpenAIApi(config);

const testQuestion = "what is a lucid dream?"
const prompt = promptGenerator(testQuestion);

export async function analyser(event) {
  try {
    const completion = await openai.createCompletion({
      model: model,
      prompt: prompt,
      temperature: 0,
      max_tokens: 250,
    });

    return {
      body: { result: completion.data.choices[0].text },
      input: event,
    };
  } catch (error) {
    console.log(error);
    return {
      body: JSON.stringify({ error: error.message }),
      input: event,
    };
  }
}

