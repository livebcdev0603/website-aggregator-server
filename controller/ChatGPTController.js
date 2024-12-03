import puppeteer from "puppeteer";
import { ChatGPTAPI } from "chatgpt";

import { OPENAI_API_KEY } from "../config/env.js";

const database = [];
const generateID = () => Math.random().toString(36).substring(2, 10);

async function chatgptFunction(content = "") {
  const api = new ChatGPTAPI({ apiKey: OPENAI_API_KEY });

  const getBrandName = await api.sendMessage(
    `I have a raw text of a website, what is the brand name in a single word? ${content}`
  );
  const getBrandDescription = await api.sendMessage(
    `I have a raw text of a website, can you extract the description of the website from the raw text. I need only the description and nothing else. ${content}`
  );

  return {
    brandName: getBrandName.text,
    brandDescription: getBrandDescription.text,
  };
}

export const getData = (req, res) => {
  const { url } = req.body;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // await page.screenshot({
    //   path: `./screenshot_${generateID()}.png`,
    // });
    // await page.pdf({
    //   path: `./doc_${generateID()}.pdf`,
    //   format: "A4",
    // });

    const websiteContent = await page.evaluate(() => {
      return document.documentElement.innerText.trim();
    });
    const websiteOgImage = await page.evaluate(() => {
      const metas = document.getElementsByTagName("meta");
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") === "og:image") {
          return metas[i].getAttribute("content");
        }
      }
    });

    let result = await chatgptFunction(websiteContent);
    result.brandImage = websiteOgImage;
    result.id = generateID();
    database.push(result);

    await browser.close();

    return res.json({
      message: "Request successful!",
      database,
    });
  })();
};
