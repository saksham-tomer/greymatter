import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';

// Load environment variables
process.env.GOOGLE_API_KEY = "AIzaSyAFbxx4LAR7KQaeCf0lJmiPd4nae2f60Nw";


// Create Wormhole-specific Prompt Template
const wormholePrompt = ChatPromptTemplate.fromTemplate(`
   
    only answer question about the wormhole blockchain in 30 words, any other unrelated question return an empty response!!!!
`);

// Function to generate Wormhole-specific response
export async function generateWormholeResponse(context, query) {
    try {
        // Initialize Gemini AI Model
        const geminiLLM = new ChatGoogleGenerativeAI({
            model: "gemini-pro",
            temperature: 0.7,
            maxOutputTokens: 300
        });

        // Create the chain
        const chain = wormholePrompt.pipe(geminiLLM);

        // Generate response
        const response = await chain.invoke({
            context: context,
            query: query
        });

        // Validate response
        if (!response.content.trim()) {
            throw new Error("Empty response generated");
        }

        return response.content;
    } catch (error) {
        console.error(`Wormhole response generation error: ${error.message}`);
        return "Unable to generate wormhole-specific response at this time.";
    }
}

// Example Usage
   export const context = `
    `;
    

    // Generate and print response

