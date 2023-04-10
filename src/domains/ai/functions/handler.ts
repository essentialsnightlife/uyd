import { sendAIQuestion } from "./";
import { promptGenerator } from "./";
import { OPENAI_MODEL_CONFIG } from "../../../fe/src/constants";

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
            model: OPENAI_MODEL_CONFIG.model,
            prompt: prompt,
            temperature: OPENAI_MODEL_CONFIG.temperature,
            max_tokens: OPENAI_MODEL_CONFIG.max_tokens,
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