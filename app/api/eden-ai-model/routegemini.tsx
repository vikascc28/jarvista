// const API_KEY = process.env.GEMINI_API_KEY; // Add this to your .env file
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

// const messages = [];

// if (aiResp) {
//     messages.push({
//         role: "model",
//         parts: [{ text: aiResp }],
//     });
// }

// messages.push({
//     role: "user",
//     parts: [{ text: userInput }],
// });


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userInput, aiResp } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Set this in your .env.local file
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    // Prepare the messages in Gemini's expected format
    const messages = [];

    if (aiResp) {
        messages.push({
            role: "model",
            parts: [{ text: aiResp }],
        });
    }

    messages.push({
        role: "user",
        parts: [{ text: userInput }],
    });

    // Make the API request to Gemini
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: messages,
        }),
    });

    const result = await response.json();

    const generated_text =
        result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Match the response format from your original EdenAI version
    const resp = {
        role: "assistant",
        content: generated_text,
    };

    return NextResponse.json(resp);
}
