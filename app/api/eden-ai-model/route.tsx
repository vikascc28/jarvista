// import { NextRequest, NextResponse } from "next/server";
// import { OpenAI } from "openai";

// const baseURL = "https://api.aimlapi.com/v1";

// export async function POST(req: NextRequest) {
//   const { userInput, aiResp } = await req.json();

//   const api = new OpenAI({
//     apiKey: process.env.AIML_API_KEY,
//     baseURL,
//   });

//   const messages = [
//     {
//       role: "system",
//       content: "You are a helpful assistant.",
//     },
//     {
//       role: "user",
//       content: userInput,
//     },
//   ];

//   if (aiResp) {
//     messages.push({
//       role: "assistant",
//       content: aiResp,
//     });
//   }

//   const completion = await api.chat.completions.create({
//     model: "mistralai/Mistral-7B-Instruct-v0.2",
//     messages,
//     temperature: 0.7,
//     max_tokens: 1000,
//   });

//   const responseText = completion.choices[0].message.content;

//   return NextResponse.json({
//     role: "assistant",
//     content: responseText,
//   });
// }
