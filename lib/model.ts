import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

process.env.GOOGLE_API_KEY = "AIzaSyAFbxx4LAR7KQaeCf0lJmiPd4nae2f60Nw";
// Create a more robust SOON-specific tool
const SOONTool = tool(
  async () => {
    return "The query...";
  },
  {
    name: "SOON_analyzer",
    description: "Analyzes and responds to SOON queries",
    schema: z.object({
      answer: z
        .string()
        .optional()
        .describe(
          "the respone of the SOON blockchain query from google search max 50 words "
        ),
    }),
  }
);

// Utility function to calculate SOON relevance
// Function to generate SOON-specific response

// Main SOON response generation function
export async function generateSOONAIResponse(
  context: string,
  query: string
) {
  try {
    // Initialize Gemini AI Model with SOON tool
    const geminiLLM = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      maxOutputTokens: 400,
      temperature: 0.9,
    }).bindTools([SOONTool]);

    // Create SOON-specific Prompt Template
    const SOONPrompt = ChatPromptTemplate.fromTemplate(`
      Strictly adhere to these rules:
      -  answer questions about SOON blockchain   
      - answer must should be less than 50 words
      - any unrelated query dont give a response
      - answer questions related to Defi 
      - any query related to cross-chain aggregators

      Context: {context}
      Query: {query}
    `);

    // Create the chain
    const chain = SOONPrompt.pipe(geminiLLM);

    // Generate response
    const response = await chain.invoke({
      context: context,
      query: query,
    });

    // Validate response
    console.log(response);
    if (!response.content.trim()) {
      return "Unable to generate SOON-specific response at this time";
    }

    console.log(response.tool_calls);

    return response.content;
  } catch (error) {
    console.error(`SOON AI response generation error:`, error);
    return "Unable to generate SOON-specific response at this time.";
  }
}

// Example usage
async function main() {
  const context = "SOON is a leading cross-chain communication protocol";
  const query = "jkbkjbkjbkbhk";

  const response = await generateSOONAIResponse(context, query);
  console.log("eedde");
  console.log(response);
}

// Uncomment to run
main();
