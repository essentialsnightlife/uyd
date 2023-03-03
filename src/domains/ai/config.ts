import { Configuration } from "openai";
import { Constants } from "../../../constants";

export const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const botInstructions: string = Constants.BOT_INSTRUCTIONS;
