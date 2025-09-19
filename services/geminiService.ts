import { GoogleGenAI, Type } from "@google/genai";
import type { SnippetGroup } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        groupTitle: {
          type: Type.STRING,
          description: "A concise title for the group of snippets, e.g., 'Utility Functions' or 'API Integration'."
        },
        groupDescription: {
          type: Type.STRING,
          description: "A one-sentence description of the purpose of this group of code snippets."
        },
        snippets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The name of the function, class, or a short title for the code snippet."
              },
              description: {
                type: Type.STRING,
                description: "A brief, one-sentence explanation of what the code snippet does."
              },
              language: {
                type: Type.STRING,
                description: "The programming language of the code, e.g., 'javascript', 'python', 'typescript'."
              },
              code: {
                type: Type.STRING,
                description: "The complete, self-contained code of the snippet. It MUST include all necessary imports and brief, helpful comments explaining its purpose and usage."
              }
            },
             required: ["title", "description", "language", "code"]
          }
        }
      },
      required: ["groupTitle", "groupDescription", "snippets"]
    }
};

export async function analyzeCode(code: string): Promise<SnippetGroup[]> {
    const prompt = `
You are an expert code analyst specializing in creating portable, reusable code snippets. Your task is to analyze the following source code, identify its programming language, and break it down into self-contained, well-documented snippets.

Instructions:
1.  Analyze the code provided below.
2.  Extract meaningful snippets such as functions, classes, configuration objects, or key algorithmic sections.
3.  **Crucially, ensure each snippet is self-contained.** This means you MUST include all necessary import statements or dependencies at the top of the code block for that snippet to run independently.
4.  **Add concise, helpful comments within the code.** These comments should briefly explain the snippet's purpose, its ideal use case (where it excels), and how to use it.
5.  Group related snippets by their purpose (e.g., 'Utility Functions', 'Data Models', 'Event Handlers').
6.  For each snippet, provide a clear title, a one-sentence description, its programming language, and the final, commented, and self-contained code block.
7.  Ensure the output is a valid JSON array matching the provided schema, with no additional commentary or explanations.

Code to analyze:
\`\`\`
${code}
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation to ensure it's an array of groups
        if (Array.isArray(parsedJson) && parsedJson.every(group => group.groupTitle && group.snippets)) {
          return parsedJson as SnippetGroup[];
        } else {
          throw new Error("Parsed JSON does not match the expected structure.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
}