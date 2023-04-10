import { Configuration } from "openai";

export const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

