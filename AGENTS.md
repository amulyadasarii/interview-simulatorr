# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

An AI-powered mock job interview simulator. The candidate picks a job role and an interview style, then chats with an AI acting as the interviewer, which asks questions one at a time and delivers a structured evaluation at the end. Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| AI | TanStack AI with multi-provider support (Anthropic, OpenAI, Gemini, Ollama) |
| Language | TypeScript (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public/                       # Static assets (favicon, logos)
├── src
│   ├── lib
│   │   └── ai-hook.ts            # useAIChat hook: wraps useChat with a fetchServerSentEvents connection to /api/chat, forwards {role, interviewType} as the request body
│   ├── routes
│   │   ├── __root.tsx            # Root layout: HTML shell, page title, global styles
│   │   ├── api.chat.ts           # POST handler for /api/chat: builds the interviewer system prompt from role/interviewType, streams a multi-provider AI response over SSE
│   │   └── index.tsx             # Home route: role/interview-type setup screen, then the interview chat UI (messages, input, stop, "new interview" reset)
│   ├── router.tsx                # TanStack Router setup
│   └── styles.css                # Tailwind + chat/markdown styling
├── netlify.toml                  # Netlify build command, publish directory, dev server settings
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Concepts

### Interview Flow

1. `index.tsx` shows a setup screen where the candidate enters a job role/title and picks an interview type (behavioral, technical, case study).
2. On start, the app sends a kickoff message to `/api/chat`, along with `{ role, interviewType }` as request body data.
3. `api.chat.ts` builds a system prompt instructing the model to act as the interviewer for that role/style, ask one question at a time, and produce a structured Overall Impression / Strengths / Areas to Improve / Score evaluation once the candidate ends the interview.
4. Responses stream back over SSE and render as chat bubbles via `Streamdown`.

### AI Integration

Multi-provider AI chat with fallback chain, selected server-side based on which API key is present:

1. Anthropic Claude (`claude-haiku-4-5`) — preferred, via Netlify AI Gateway
2. OpenAI (`gpt-4o`)
3. Google Gemini (`gemini-2.0-flash-exp`)
4. Ollama (local fallback)

No tools are used — the interviewer relies purely on the system prompt and conversation history.

### File-Based Routing (TanStack Router)

- `__root.tsx` - Root layout wrapping all pages
- `index.tsx` - Route for `/`
- `api.chat.ts` - Server API endpoint for `/api/chat`

## Environment Variables

For AI functionality, Netlify AI Gateway automatically injects credentials when the project has a production deploy. Locally, set one or more:

```
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Conventions

- Components/routes: PascalCase for components, kebab/dot-case for route files
- TypeScript strict mode, `@/*` path alias for `src/*`
- Tailwind CSS utility classes for styling
