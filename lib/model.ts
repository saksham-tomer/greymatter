import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { z } from "zod";


process.env.GOOGLE_API_KEY="AIzaSyAFbxx4LAR7KQaeCf0lJmiPd4nae2f60Nw"
// Create a more robust Wormhole-specific tool
const wormholeTool = tool(
  async (_) => {

    return "The query..."    ;
  },
  {
    name: "wormhole_analyzer",
    description: "Analyzes and responds to Wormhole queries",
    schema: z.object({
      answer: z.string().optional().describe("the respone of the wormhole blockchain query from google search max 50 words ")
    })
  }
);

// Utility function to calculate Wormhole relevance
// Function to generate Wormhole-specific response

// Main Wormhole response generation function
export async function generateWormholeAIResponse(context: string, query: string) {
  try {
    // Initialize Gemini AI Model with Wormhole tool
    const geminiLLM = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
      maxOutputTokens: 400,
      temperature:0.9
    }).bindTools([wormholeTool]);

    // Create Wormhole-specific Prompt Template
    const wormholePrompt = ChatPromptTemplate.fromTemplate(`
      Strictly adhere to these rules:
      -  answer questions about wormhole blockchain   
      - answer must should be less than 50 words
      - any unrelated query dont give a response
      - answer questions related to Defi 
      - any query related to cross-chain aggregators

      Context: {context}
      Query: {query}
    `);

    // Create the chain
    const chain = wormholePrompt.pipe(geminiLLM);

    // Generate response
    const response = await chain.invoke({
      context: context,
      query: query
    });

    // Validate response
    console.log(response)
    if (!response.content.trim()) {
        return "Unable to generate Wormhole-specific response at this time"
    }

    console.log(response.tool_calls);


    return response.content;
  } catch (error) {
    console.error(`Wormhole AI response generation error:`, error);
    return "Unable to generate Wormhole-specific response at this time.";
  }
}

// Example usage
async function main() {
  const context = "Wormhole is a leading cross-chain communication protocol";
  const query = "jkbkjbkjbkbhk";

  const response = await generateWormholeAIResponse(context, query);
  console.log("eedde")
  console.log(response)
}

// Uncomment to run
main();