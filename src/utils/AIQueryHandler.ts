// src/utils/AIQueryHandler.ts

import OpenAI from 'openai';
import { ContextAssembler } from './ContextAssembler';

const api = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_AIML_API_KEY,
  baseURL: 'https://api.aimlapi.com/v1',
  dangerouslyAllowBrowser: true
});

export class AIQueryHandler {
  static async processQuery(query: string): Promise<string> {
    try {
      const context = await ContextAssembler.assembleContext(query);

      const messages = [
        { role: 'system' as const, content: 'You are a helpful assistant that answers questions based on the provided context.' },
        { role: 'user' as const, content: `Context: ${context}\n\nQuestion: ${query}` }
      ];

      const completion = await api.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
      });

      return completion.choices[0].message.content || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error processing AI query:', error);
      throw error;
    }
  }
}