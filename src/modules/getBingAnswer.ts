import { BingChat, ChatMessage, SendMessageOptions } from "bing-chat-rnz";

import bingApi from "../db/bing";

const DEFAULT_TIMEOUT = 75000;

export const getBingAnswer = async (
  message: string,
  options: SendMessageOptions
) => {
  const cookie = await bingApi.readAccount();

  if (!cookie || !cookie.cookie) {
    throw new Error("Закончились аккаунты");
  }

  const api = new BingChat({
    cookie: cookie.cookie,
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
    bingApi.deleteAccount(cookie._id);
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
