require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModelId = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let generativeModel = null;

if (geminiApiKey) {
  const client = new GoogleGenerativeAI(AIzaSyAkqsj_GQbN61t8XcrHC6sVmb15PEG7cW8);
  generativeModel = client.getGenerativeModel({ model: geminiModelId });
}

const MAX_INPUT_CHARS = 15000;

function buildPrompt({ sourceText, questionCount }) {
  return `You are an expert instructional designer. Your task is to create a rigorous multiple-choice quiz from the provided course materials.

Requirements:
- Generate exactly ${questionCount} questions unless the material truly cannot support that many (minimum 3).
- Each question must be meaningful, concept-focused, and answerable from the provided material.
- Use varied question styles (definition, application, conceptual understanding). Avoid trivial recall or copying headings.
- Provide 4 answer options labelled A-D implicitly in the array order. Options must be distinct, concise, and plausible.
- Indicate the single correct option using the zero-based index field "correctIndex".
- Provide a short explanation (1-2 sentences) referencing the material for why the correct answer is right.
- If there is insufficient information for a question, omit it.
- Output valid JSON with this schema:
{
  "title": string,
  "questions": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number,
      "explanation": string
    }
  ]
}

Source material:
${sourceText}`;
}

async function callGemini({ text, questionCount }) {
  if (!generativeModel) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const truncated = text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) : text;
  const prompt = buildPrompt({ sourceText: truncated, questionCount });

  const response = await generativeModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const textResponse = response.response.text();

  let parsed;
  try {
    parsed = JSON.parse(textResponse);
  } catch (error) {
    console.error('Failed to parse Gemini response', error, textResponse);
    throw new Error('Model returned invalid JSON');
  }

  if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Model did not return any questions');
  }

  const sanitizedQuestions = parsed.questions
    .filter((q) =>
      q &&
      typeof q.question === 'string' && q.question.trim().length > 0 &&
      Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4
    )
    .map((q) => ({
      question: q.question.trim(),
      options: q.options.map((opt) => String(opt).trim()),
      correctIndex: Number(q.correctIndex),
      explanation: q.explanation ? String(q.explanation).trim() : '',
    }));

  if (sanitizedQuestions.length === 0) {
    throw new Error('Model output did not contain valid questions');
  }

  return {
    title: parsed.title && parsed.title.trim().length ? parsed.title.trim() : 'AI-generated Quiz',
    questions: sanitizedQuestions.slice(0, questionCount),
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, model: geminiModelId, ready: Boolean(generativeModel) });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { text, count } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({ error: 'A longer text sample is required to generate questions.' });
    }

    const desiredCount = Math.min(Math.max(Number(count) || 10, 3), 20);

    const quiz = await callGemini({ text, questionCount: desiredCount });

    res.json({ quiz });
  } catch (error) {
    console.error('Generation failed', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' });
  }
});

app.listen(port, () => {
  console.log(`AI quiz server listening on http://localhost:${port}`);
});

