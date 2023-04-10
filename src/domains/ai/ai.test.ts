import { promptGenerator } from "./functions";
import { BOT_INSTRUCTIONS } from "../../fe/src/constants";

const botInstructions: string = BOT_INSTRUCTIONS;

test("prompt generator adds question to bot instructions", () => {
  expect(promptGenerator("with test question")).toBe(
    botInstructions + "with test question"
  );
});
