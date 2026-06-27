import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
// gemini
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});
// mistral
const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

// tool searchInternet
const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "use this tool to get latest information from internert",
  schema: z.object({
    query: z.string().describe("the search query to look up on the internet."),
  }),
});
const internetAgent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
  systemPrompt: `
  You are a helpful assistant.

  Always use searchInternet tool for:
  - latest information
  - current events
  - sports results
  - prices
  - news
  Never answer current questions from memory.
  `,
});

// genrate ai response
export async function genrateResponse(messages) {
  console.log(messages);
  const response = await internetAgent.invoke({
    messages: [...messages],
  });
  const lastMessage = response.messages[response.messages.length - 1];
  console.log(lastMessage);

  return typeof lastMessage.content === "string"
    ? lastMessage.content
    : lastMessage.content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("");
}
// genrate title
export async function genrateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You generate chat titles.

Rules:
- Return ONLY the title
- Maximum 5 words
- Plain text only
- No markdown
- No quotes
- No punctuation
- No explanations
- No extra text
`),
    new HumanMessage(`
       Generate a short title for this conversation:
         ' ${message}'
        `),
  ]);
  return response.content
    .replace(/[*"#`]/g, "")
    .replace(/['"]/g, "")
    .replace(/\n/g, "")
    .trim();
}
