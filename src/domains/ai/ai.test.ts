import { promptGenerator } from "./functions";
import { Constants } from "../../../constants";

const botInstructions: string = Constants.BOT_INSTRUCTIONS;

test("prompt generator adds question to bot instructions", () => {
  expect(promptGenerator("with test question")).toBe(
    botInstructions + "with test question"
  );
});
