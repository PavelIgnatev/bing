import { getBingAnswer } from "./getBingAnswer";
import { withExponentialBackoff } from "../helpers/withExponentialBackoff";

export const getAnswer = async (
  messages: Array<string> = [],
  variant: "Creative" | "Precise" = "Precise"
) => {
  let options = { variant };
  let result: null | string = null;

  for (let message of messages) {
    try {
      console.log(
        "\x1b[36m%s\x1b[0m: %s",
        "Направляю запрос в Bing для получения ответа",
        message
      );
      const response = await withExponentialBackoff({
        func: () => {
          return getBingAnswer(message, options);
        },
        maxRetries: 3,
        delay: 3000,
      });

      const { text, conversationOptions } = response;
      options = {
        ...conversationOptions,
        variant,
      };

      console.log("\x1b[36m%s\x1b[0m: %s", "Ответ от Bing", text, "\n");
      result = text;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return result;
};
