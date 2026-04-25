import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export const dynamic = 'force-dynamic'

// Uses Ilmu AI (OpenAI-compatible) with GLM-5.1
const BASE_URL = process.env.ILMU_BASE_URL ?? 'https://api.ilmu.ai/v1'
const MODEL = process.env.ILMU_MODEL ?? 'ilmu-glm-5.1'

async function callGLM(messages: { role: string; content: string }[], apiKey: string) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Ilmu AI error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content as string
}

function buildSystemPrompt(feature: string, store: ReturnType<typeof getStore>): string {
  const stockSummary = store.stockItems
    .map(i => `${i.name}: ${i.currentStock}${i.unit} (risk: ${i.riskLevel})`)
    .join(', ')
  const salesSummary = `Today: RM${store.metrics.todaySales.toFixed(2)}, ${store.metrics.totalTransactions} transactions, avg RM${store.metrics.averageOrderValue.toFixed(2)}`
  const topItems = store.transactions
    .slice(0, 10)
    .flatMap(t => t.items.map(i => i.name))
    .reduce((acc: Record<string, number>, name) => { acc[name] = (acc[name] || 0) + 1; return acc }, {})
  const topItemsList = Object.entries(topItems).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n]) => n).join(', ')

  return `You are MindaAI, an intelligent assistant for MindaFinancial — a smart F&B SME management system for Malaysian hawkers and small restaurants.

Current business context:
- Stock: ${stockSummary}
- Sales: ${salesSummary}
- Top selling items today: ${topItemsList}
- Waste this week: RM${store.metrics.wasteThisWeek.toFixed(2)}
- Active vendors: ${store.metrics.activeVendors}

Feature context: ${feature}

Respond helpfully and concisely. Use RM for currency. Focus on practical advice for Malaysian F&B SMEs. Keep responses under 300 words unless more detail is requested.`
}

export async function POST(req: NextRequest) {
  const { feature, message, context } = await req.json()

  const apiKey = process.env.ILMU_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ILMU_API_KEY not set in .env.local' },
      { status: 503 }
    )
  }
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const store = getStore()
  const featureDescriptions: Record<string, string> = {
    dashboard: 'Business overview and daily performance analysis',
    stock: 'Inventory management and reorder recommendations',
    rush: 'Rush hour prediction and demand forecasting',
    vendors: 'Vendor relationship and ordering optimization',
    transactions: 'Transaction analysis and revenue insights',
    pricing: 'Menu pricing optimization and margin analysis',
    waste: 'Waste reduction and spoilage prevention',
    general: 'General business assistance',
  }

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: buildSystemPrompt(featureDescriptions[feature] ?? featureDescriptions.general, store) },
  ]

  if (context) {
    messages.push({ role: 'user', content: `Additional context: ${JSON.stringify(context)}` })
    messages.push({ role: 'assistant', content: 'Understood. I have reviewed the context.' })
  }

  messages.push({ role: 'user', content: message })

  try {
    const reply = await callGLM(messages, apiKey)
    return NextResponse.json({ reply, model: MODEL })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Ilmu AI]', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}