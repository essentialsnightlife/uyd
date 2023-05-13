export const ANALYSER_INPUT_MAX_CHARS = 200;
export const AWS_REGION = 'eu-west-2';
export const BOT_INSTRUCTIONS =
  "Give answers with a recommendation unless I give you a question that is nonsense or not related to a dream or sleep, then respond with 'Sorry I'm not woke enough to answer with that, I only deal with dreams!' The question is: ";

export const DEFAULT_TEMPERATURE = 0;
export const DEFAULT_MODEL = 'text-davinci-003';
// https://platform.openai.com/docs/models/overview
export const DEFAULT_MAX_TOKENS = 250;

export const DEFAULT_MAX_API_CALLS = 3;

export const OPENAI_MODEL_CONFIG = {
  model: DEFAULT_MODEL,
  temperature: DEFAULT_TEMPERATURE,
  max_tokens: DEFAULT_MAX_TOKENS,
};
