// app/api/gemini-model/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { provider, userInput } = await request.json();
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Split input into parts (user input : instruction)
    const [actualInput, instruction] = userInput.split(':');
    
    const prompt = `
      You are an AI assistant. Respond in well-formatted Markdown.
      ${instruction ? `Role: ${instruction}` : ''}
      
      User request: ${actualInput}
      
      Format your response with:
      - Headings (##)
      - Bullet points
      - Tables when appropriate
      - Horizontal rules (---)
      - Relevant emojis
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({
      content: text,
      model: 'Gemini Flash'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(JSON.stringify({
      error: "Failed to generate response"
    }), { status: 500 });
  }
}