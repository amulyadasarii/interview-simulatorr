# Interview Simulator

An AI-powered mock job interview simulator. Pick a job role and an interview style (behavioral, technical, or case study), and chat with an AI interviewer that asks questions one at a time, reacts naturally to your answers, and gives a structured evaluation — strengths, areas to improve, and a score — once you end the session.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router)
- Vite 7
- Tailwind CSS 4
- [TanStack AI](https://tanstack.com/ai) for streaming chat, with multi-provider support (Anthropic, OpenAI, Gemini, Ollama)
- Deployed on Netlify, using Netlify AI Gateway for zero-config model access

## Running locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### AI provider

When deployed on Netlify with AI Gateway enabled, credentials are injected automatically. For local development, set one of the following environment variables so the chat endpoint can pick a provider:

```
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

If none are set, it falls back to a local Ollama model.

## How it works

1. On the home page, enter a job role/title and choose an interview type.
2. The AI interviewer greets you and asks its first question — answer in the chat input.
3. Continue the conversation like a real interview; the AI asks follow-up questions of increasing depth.
4. Say something like "end interview" at any point to receive a final evaluation.
