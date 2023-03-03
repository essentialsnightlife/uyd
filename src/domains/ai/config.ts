import { Configuration } from "openai";
import {Constants} from "../../../constants";

export const config  = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const botInstructions = Constants.BOT_INSTRUCTIONS;

export const model = Constants.MODEL;

