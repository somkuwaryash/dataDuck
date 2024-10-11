import OpenAI from 'openai';

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.NEXT_PUBLIC_AIML_API_KEY;

const api = new OpenAI({
  apiKey,
  baseURL,
  dangerouslyAllowBrowser: true,
});

export interface AIResponse {
  text: string;
  code?: string;
}

export async function queryAI(userPrompt: string, systemPrompt: string): Promise<AIResponse> {
  try {
    const completion = await api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    console.log(response);

    if (!response) {
      throw new Error("No response from AI");
    }

    // Simple parsing to separate code from text
    const codeMatch = response.match(/```python([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : undefined;
    const text = response.replace(/```python[\s\S]*?```/g, '').trim();

    return { text, code };
  } catch (error) {
    console.error("Error querying AI:", error);
    throw error;
  }
}