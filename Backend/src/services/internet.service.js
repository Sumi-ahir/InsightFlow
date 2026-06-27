import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const searchInternet = async ({ query }) => {
  console.log("tavily query:", query);
  const result = await tavily.search(query, {
    maxResults: 2,
    searchDepth: "advanced",
  });
  console.log(result);

  return JSON.stringify(
    result.results.map((item) => ({
      title: item.title,
      content: item.content.slice(0, 500),
    })),
  );
};
