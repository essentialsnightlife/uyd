import { sendAIQuestion } from "./";
import { promptGenerator } from "./";
import { Constants } from "../../../../constants";

const modelConfig = Constants.OPENAI_MODEL_CONFIG;
export async function analyser(event) {
    const prompt = promptGenerator(event.body);

    if (!event.body) {
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
    } catch (err) {
        console.log("Error: ", err);

        return {
            body: { error: err.message },
            input: event,
        };
    }
}