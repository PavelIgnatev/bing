import { BingChat, ChatMessage, SendMessageOptions } from "bing-chat-rnz";

import bingApi from "../db/bing";

const args = process.argv.slice(2); 
if (args.length === 0) {
  console.log('Пожалуйста, укажите параметр cookie.');
  process.exit(1);
}

const DEFAULT_TIMEOUT = 75000;

const getBingAnswer = async (
    cookie: string,
) => {
    const api = new BingChat({
        cookie,
    });

    const res = (await Promise.race([
        api.sendMessage('Write word "OK"', { variant: 'Precise' }),
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

    console.log('Ответ от Bing: ', res.text)

    if (!res.text) {
        return
    }
    
    await bingApi.insertAccount({ cookie })
    console.log('Можно!')
    return
};

getBingAnswer(args[0]).then(() => process.exit(1)).catch(() => process.exit(1))