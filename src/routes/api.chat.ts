import { createFileRoute } from '@tanstack/react-router'
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { openaiText } from '@tanstack/ai-openai'
import { geminiText } from '@tanstack/ai-gemini'
import { ollamaText } from '@tanstack/ai-ollama'

function buildSystemPrompt(role: string, interviewType: string) {
  return `You are an experienced hiring manager conducting a mock job interview for the position of "${role}". This is a ${interviewType} interview.

INSTRUCTIONS:
- Stay in character as the interviewer for the entire conversation.
- Ask ONE interview question at a time, and wait for the candidate's answer before asking the next one.
- Tailor your questions to the "${role}" role and the "${interviewType}" interview style (e.g. behavioral questions should use the STAR method, technical questions should probe real skills for this role).
- After each answer, briefly acknowledge it in a natural, conversational way (a sentence or two) before moving to the next question. Do not give a full critique after every answer.
- Ask around 5-7 questions total, gradually increasing in depth.
- If the candidate asks to end the interview, or says something like "end interview" or "that's all", stop asking questions and instead provide a structured final evaluation with these sections: Overall Impression, Strengths, Areas to Improve, and a Score out of 10. Be honest, specific, and constructive.
- Keep your tone professional, encouraging, and realistic, as a real interviewer would be.
- Begin the conversation with a short greeting and your first question.`
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestSignal = request.signal

        if (requestSignal.aborted) {
          return new Response(null, { status: 499 })
        }

        const abortController = new AbortController()

        try {
          const body = await request.json()
          const { messages } = body
          const data = body.data || {}

          const role: string = data.role || 'Software Engineer'
          const interviewType: string = data.interviewType || 'behavioral'

          // Determine the best available provider
          let provider: 'anthropic' | 'openai' | 'gemini' | 'ollama' =
            data.provider || 'ollama'
          let model: string = data.model || 'mistral:7b'

          // Use the first available provider with an API key, fallback to ollama
          if (process.env.ANTHROPIC_API_KEY) {
            provider = 'anthropic'
            model = 'claude-haiku-4-5'
          } else if (process.env.OPENAI_API_KEY) {
            provider = 'openai'
            model = 'gpt-4o'
          } else if (process.env.GEMINI_API_KEY) {
            provider = 'gemini'
            model = 'gemini-2.0-flash-exp'
          }

          const adapterConfig = {
            anthropic: () =>
              anthropicText((model || 'claude-haiku-4-5') as any),
            openai: () => openaiText((model || 'gpt-4o') as any),
            gemini: () => geminiText((model || 'gemini-2.0-flash-exp') as any),
            ollama: () => ollamaText((model || 'mistral:7b') as any),
          }

          const adapter = adapterConfig[provider]()

          const stream = chat({
            adapter,
            systemPrompts: [buildSystemPrompt(role, interviewType)],
            agentLoopStrategy: maxIterations(5),
            messages,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          console.error('Chat error:', error)
          if (error.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 })
          }
          return new Response(
            JSON.stringify({
              error: 'Failed to process chat request',
              message: error.message,
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
