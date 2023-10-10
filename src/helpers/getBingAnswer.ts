import { BingChat, ChatMessage, SendMessageOptions } from "bing-chat-rnz";

import { getRandomCookie } from "./getRandomCookie";

const DEFAULT_TIMEOUT = 75000;

export const getBingAnswer = async (
  message: string,
  options: SendMessageOptions
) => {
  const api = new BingChat({
    cookie: getRandomCookie(),
  });

  const res = (await Promise.race([
    api.sendMessage(message, options),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Время ожидания ответа от Bing превысило ${DEFAULT_TIMEOUT}ms`
            )
          ),
        DEFAULT_TIMEOUT
      )
    ),
  ])) as ChatMessage;

  if (!res.text) {
    throw new Error("Пустой ответ от Bing");
  }

  return {
    text: res.text,
    conversationOptions: {
      conversationId: res.conversationId,
      clientId: res.clientId,
      conversationSignature: res.conversationSignature,
    },
  };
};
