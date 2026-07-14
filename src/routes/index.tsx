import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Send,
  Square,
  RotateCcw,
  ArrowRight,
  Puzzle,
  MessagesSquare,
  BarChart3,
} from 'lucide-react'
import { Streamdown } from 'streamdown'

import { useAIChat } from '@/lib/ai-hook'
import type { ChatMessages } from '@/lib/ai-hook'

const INTERVIEW_TYPES = [
  { value: 'behavioral', label: 'Behavioral', blurb: 'Stories about how you work' },
  { value: 'technical', label: 'Technical', blurb: 'Problem solving under pressure' },
  { value: 'case-study', label: 'Case Study', blurb: 'Structured, open-ended problems' },
]

const ROLE_PRESETS = [
  { role: 'Software Engineer', label: 'Software', emoji: '💻' },
  { role: 'Java Developer', label: 'Java', emoji: '☕' },
  { role: 'UI/UX Designer', label: 'UI/UX', emoji: '🎨' },
  { role: 'Product Manager', label: 'Product', emoji: '📊' },
  { role: 'Data Scientist', label: 'Data Science', emoji: '🧪' },
  { role: 'Marketing Lead', label: 'Marketing', emoji: '📣' },
]

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-8 lg:py-0">
      <div className="rise-in flex-1 text-center lg:text-left">
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
          <span aria-hidden className="mr-2">
            🤖
          </span>
          Interview Simulator
        </h1>

        <ul className="mx-auto mt-6 max-w-md space-y-3 text-lg text-ink/70 lg:mx-0">
          {[
            'Practice real interviews',
            'Build confidence',
            'Track your progress',
          ].map((line) => (
            <li key={line} className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
              {line}
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="btn-lift group mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25"
        >
          Start Interview
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-6 text-sm text-ink/40">Created by Amulya</p>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="relative mx-auto h-[420px] w-[420px]">
          <div
            className="glass-card float-card absolute top-6 left-2 w-64 rounded-3xl p-5 shadow-xl"
            style={{ animationDelay: '-1s' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                <MessagesSquare className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-ink">Interviewer</span>
            </div>
            <p className="text-sm text-ink/70">
              "Tell me about a time you shipped something under a tight deadline."
            </p>
          </div>

          <div
            className="glass-card float-card absolute top-52 right-0 w-56 rounded-3xl p-5 shadow-xl"
            style={{ animationDelay: '-2.5s' }}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <BarChart3 className="h-4 w-4 text-accent" />
              Session score
            </div>
            <div className="font-display text-3xl font-semibold text-primary">8.4</div>
            <p className="text-xs text-ink/60">Strong structure, confident delivery</p>
          </div>

          <div
            className="glass-card float-card absolute bottom-4 left-16 w-48 rounded-3xl p-4 shadow-xl"
            style={{ animationDelay: '-3.5s' }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Puzzle className="h-4 w-4 text-secondary" />
              Case Study
            </div>
            <p className="mt-1 text-xs text-ink/60">Question 3 of 5</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({
  onBegin,
}: {
  onBegin: (role: string, interviewType: string) => void
}) {
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [interviewType, setInterviewType] = useState('behavioral')

  const effectiveRole = useCustom ? customRole : role

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-16">
      <div className="rise-in text-center">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Pick a role to practice
        </h2>
        <p className="mt-2 text-ink/60">Choose a preset or set your own job title.</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ROLE_PRESETS.map((preset) => {
          const selected = !useCustom && role === preset.role
          return (
            <button
              key={preset.role}
              type="button"
              onClick={() => {
                setUseCustom(false)
                setRole(preset.role)
              }}
              className={`btn-lift glass-card flex flex-col items-center gap-2 rounded-2xl px-4 py-6 shadow-md transition-colors ${
                selected
                  ? 'border-primary/60 bg-white/90 ring-2 ring-primary/50'
                  : ''
              }`}
            >
              <span className="text-3xl">{preset.emoji}</span>
              <span className="text-sm font-semibold text-ink">{preset.label}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => setUseCustom(true)}
          className={`btn-lift glass-card flex flex-col items-center gap-2 rounded-2xl px-4 py-6 shadow-md transition-colors ${
            useCustom ? 'border-primary/60 bg-white/90 ring-2 ring-primary/50' : ''
          }`}
        >
          <span className="text-3xl">✍️</span>
          <span className="text-sm font-semibold text-ink">Custom role</span>
        </button>
      </div>

      {useCustom && (
        <input
          type="text"
          autoFocus
          value={customRole}
          onChange={(e) => setCustomRole(e.target.value)}
          placeholder="e.g. Site Reliability Engineer"
          className="glass-card mt-4 w-full rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      )}

      <div className="mt-10">
        <p className="mb-3 text-center text-sm font-semibold text-ink/70 sm:text-left">
          Interview style
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {INTERVIEW_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setInterviewType(type.value)}
              className={`btn-lift glass-card rounded-2xl px-4 py-3 text-left shadow-sm transition-colors ${
                interviewType === type.value
                  ? 'border-primary/60 bg-white/90 ring-2 ring-primary/50'
                  : ''
              }`}
            >
              <div className="text-sm font-semibold text-ink">{type.label}</div>
              <div className="text-xs text-ink/60">{type.blurb}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!effectiveRole.trim()}
        onClick={() => onBegin(effectiveRole.trim(), interviewType)}
        className="btn-lift mt-10 w-full rounded-2xl bg-gradient-to-r from-primary to-secondary py-4 text-center text-base font-semibold text-white shadow-lg shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        Begin Interview
      </button>
    </div>
  )
}

function Messages({ messages }: { messages: ChatMessages }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return null
  }

  return (
    <div
      ref={messagesContainerRef}
      className="min-h-0 flex-1 overflow-y-auto pb-4"
    >
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant'
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white ${
                  isAssistant
                    ? 'bg-gradient-to-br from-primary to-secondary'
                    : 'bg-gradient-to-br from-accent to-primary'
                }`}
              >
                {isAssistant ? '🤖' : 'Y'}
              </div>
              <div
                className={`min-w-0 max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  isAssistant
                    ? 'glass-card prose prose-sm max-w-none'
                    : 'bg-gradient-to-br from-primary to-secondary text-white'
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === 'text' && part.content) {
                    if (isAssistant) {
                      return <Streamdown key={index}>{part.content}</Streamdown>
                    }
                    return (
                      <p key={index} className="text-sm whitespace-pre-wrap">
                        {part.content}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InterviewChat({
  role,
  interviewType,
  onReset,
}: {
  role: string
  interviewType: string
  onReset: () => void
}) {
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const { messages, sendMessage, isLoading, stop } = useAIChat({
    role,
    interviewType,
  })

  useEffect(() => {
    if (!started) {
      setStarted(true)
      sendMessage(
        "Hi, I'm ready for the interview. Please introduce yourself and ask the first question.",
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex h-screen flex-col">
      <div className="glass-card mx-auto mt-4 flex w-full max-w-3xl items-center justify-between rounded-2xl px-5 py-3 shadow-sm">
        <div className="text-sm">
          <span className="font-semibold text-ink">{role}</span>
          <span className="text-ink/50"> · {interviewType} interview</span>
        </div>
        <button
          onClick={onReset}
          className="btn-lift flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/70 px-3 py-1.5 text-sm font-medium text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New interview
        </button>
      </div>

      <Messages messages={messages} />

      <div className="sticky bottom-0 left-0 right-0 px-4 pb-4">
        <div className="mx-auto w-full max-w-3xl">
          {isLoading && (
            <div className="mb-3 flex items-center justify-center">
              <button
                onClick={stop}
                className="btn-lift flex items-center gap-2 rounded-xl border border-white/60 bg-white/80 px-4 py-2 text-sm font-medium text-ink shadow-sm"
              >
                <Square className="h-4 w-4 fill-current" />
                Stop
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) {
                sendMessage(input)
                setInput('')
              }
            }}
          >
            <div className="glass-card flex items-center gap-2 rounded-2xl p-2 shadow-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer, or say 'end interview' for feedback..."
                className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-lift flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [stage, setStage] = useState<'landing' | 'setup'>('landing')
  const [session, setSession] = useState<{
    role: string
    interviewType: string
  } | null>(null)

  if (session) {
    return (
      <InterviewChat
        key={`${session.role}-${session.interviewType}`}
        role={session.role}
        interviewType={session.interviewType}
        onReset={() => {
          setSession(null)
          setStage('landing')
        }}
      />
    )
  }

  if (stage === 'landing') {
    return <Landing onStart={() => setStage('setup')} />
  }

  return (
    <Dashboard
      onBegin={(role, interviewType) => setSession({ role, interviewType })}
    />
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
