import {botInstructions} from "../config";

export const promptGenerator = (question) => {
    return botInstructions + question;
}