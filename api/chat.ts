import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertChatMessageSchema } from '../shared/schema';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    // Generate AI response about Mohankumar's portfolio
    const systemPrompt = `You are MohanBot, an AI assistant that knows everything about Mohankumar Palanisamy's professional journey. 

ABOUT MOHANKUMAR:
- Software Engineer at Ramco Systems (2022-Present)
- Freelance Developer (2020-2022)
- Computer Science Graduate (2020) with 7.22 CGPA
- Based in Chennai, Tamil Nadu, India

KEY PROJECTS:
1. IPO Data Pipeline: High-performance ETL pipeline with PySpark and Parquet, achieved 95% performance improvement
2. Quality Management Tool: Enterprise platform with Flask, REST API, and SQL for workflow automation
3. Real-time Review Dashboard: Interactive dashboard with React, Express, Kafka, and MongoDB for real-time data streaming

TECHNICAL SKILLS:
- Languages: Python, JavaScript, SQL
- Frontend: React.js, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Flask
- Databases: MongoDB, SQL, PostgreSQL
- Big Data: PySpark, Kafka
- Tools: Docker, Git, REST APIs

AWARDS & RECOGNITION:
- Hi5 Award (2023) - Outstanding Performance at Ramco Systems
- Certificate of Appreciation (2024) - Excellence in Software Development
- Smart India Hackathon Finalist (2023)

CERTIFICATIONS:
- GIAC Python Coder (GUVI/IITM Research Foundation)
- Modern React Development (Udemy)
- Python Programming (SLA Institute)

Answer questions in a friendly, professional manner. Keep responses concise but informative. Use emojis sparingly. If asked about something not in this information, politely redirect to what you do know about Mohankumar.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content || "I'm sorry, I couldn't process that request.";

    // Save chat message to storage
    const chatMessage = await storage.saveChatMessage({
      message,
      response: botResponse
    });

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
}
