'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Send, X, Loader2, Bot, User, AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface GLMChatProps {
  feature: string
  context?: Record<string, unknown>
  placeholder?: string
  suggestedPrompts?: string[]
}

export function GLMChat({ feature, context, placeholder, suggestedPrompts }: GLMChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setError(null)

    const userMsg: Message = { role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/glm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, message: msg, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI error')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }])
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Failed to reach AI'
      setError(errMsg)
      setMessages(prev => prev.slice(0, -1)) // remove user msg on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 shadow-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-3"
        size="sm"
      >
        <Sparkles className="h-4 w-4" />
        Ask MindaAI (GLM)
      </Button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-card border rounded-2xl shadow-2xl flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">MindaAI</p>
                <p className="text-xs text-muted-foreground">Powered by GLM-4</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ask me anything about your {feature} data</p>
                {suggestedPrompts && (
                  <div className="mt-3 space-y-1.5">
                    {suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => send(p)}
                        className="block w-full text-left text-xs bg-muted/60 hover:bg-muted px-3 py-2 rounded-lg text-foreground transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center mt-1">
                    <User className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="h-6 w-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                placeholder={placeholder ?? 'Ask about your business...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                disabled={loading}
              />
              <Button
                size="icon"
                className="rounded-xl h-9 w-9 bg-primary hover:bg-primary/90 flex-shrink-0"
                onClick={() => send()}
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
