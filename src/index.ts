import express, { Request, Response } from "express";

import { getAnswer } from "./modules/getBingAnswer";

const app = express();
app.use(express.json());

app.all("/answer/*", async (req: Request, res: Response) => {
  console.log("Получил запрос, начинаю исполнять");
  const { dialogue = ["Напиши слово 'привет'"] } = req.body;

  try {
    let result: string | null = null;
    let retryCount = 0;

    while (!Boolean(result) && retryCount < 5) {
      try {
        try {
          result = await getAnswer(dialogue);
          if (!result) {
            throw new Error("Пустой ответ");
          }
        } catch (err) {
          console.log(`Попытка ${retryCount + 1} ошибочна: ${err.message}`);
        }
      } catch (e) {
        console.log(`Глобальная ошибка при получении куки: ${e.message}`);
      }

      retryCount++;
    }

    if (!Boolean(result)) {
      throw new Error("Лимит ретраев");
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(null);
  }
});

app.listen(8080, async () => {
  console.log("Прокси-сервер запущен на порту 80");
});
