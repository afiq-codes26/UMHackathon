import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.ILMU_BASE_URL ?? 'https://api.ilmu.ai/v1'
const MODEL = process.env.ILMU_MODEL ?? 'ilmu-glm-5.1'

const client = new OpenAI({
  baseURL: BASE_URL,
  apiKey: process.env.ILMU_API_KEY ?? '',
})

const VALID_FEATURES = [
  'dashboard', 'stock', 'rush', 'vendors',
  'transactions', 'pricing', 'waste', 'general',
] as const

type Feature = (typeof VALID_FEATURES)[number]

const FEATURE_DESCRIPTIONS: Record<Feature, string> = {
  dashboard: 'Business overview and daily performance analysis',
  stock: 'Inventory management and reorder recommendations',
  rush: 'Rush hour prediction and demand forecasting',
  vendors: 'Vendor relationship and ordering optimization',
  transactions: 'Transaction analysis and revenue insights',
  pricing: 'Menu pricing optimization and margin analysis',
  waste: 'Waste reduction and spoilage prevention',
  general: 'General business assistance',
}

async function callGLM(messages: OpenAI.ChatCompletionMessageParam[]) {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  })

  return response.choices[0].message.content as string
}

function buildSystemPrompt(featureDesc: string, store: NonNullable<ReturnType<typeof getStore>>): string {
  const stockSummary = store.stockItems
    .map(i => `${i.name}: ${i.currentStock}${i.unit} (risk: ${i.riskLevel})`)
    .join(', ')

  const salesSummary =
    `Today: RM${store.metrics.todaySales.toFixed(2)}, ` +
    `${store.metrics.totalTransactions} transactions, ` +
    `avg RM${store.metrics.averageOrderValue.toFixed(2)}`

  const topItems = store.transactions
    .slice(0, 10)
    .flatMap(t => t.items.map(i => i.name))
    .reduce<Record<string, number>>((acc, name) => {
      acc[name] = (acc[name] || 0) + 1
      return acc
    }, {})

  const topItemsList = Object.entries(topItems)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([n]) => n)
    .join(', ')

  const topItemsDisplay = topItemsList || 'No data yet'

  return [
    'You are MindaAI, an intelligent assistant for MindaFinancial —',
    'a smart F&B SME management system for Malaysian hawkers and small restaurants.',
    '',
    'Current business context:',
    `- Stock: ${stockSummary}`,
    `- Sales: ${salesSummary}`,
    `- Top selling items today: ${topItemsDisplay}`,
    `- Waste this week: RM${store.metrics.wasteThisWeek.toFixed(2)}`,
    `- Active vendors: ${store.metrics.activeVendors}`,
    '',
    `Feature context: ${featureDesc}`,
    '',
    'Respond helpfully and concisely. Use RM for currency.',
    'Focus on practical advice for Malaysian F&B SMEs.',
    'Keep responses under 300 words unless more detail is requested.',
  ].join('\n')
}

export async function POST(req: NextRequest) {
  let body: { feature?: string; message?: string; context?: unknown; history?: { role: string; content: string }[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 },
    )
  }

  const { feature: rawFeature, message, context, history } = body

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { error: 'message is required and must be a string' },
      { status: 400 },
    )
  }

  const apiKey = process.env.ILMU_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ILMU_API_KEY not set in .env.local' },
      { status: 503 },
    )
  }

  const feature: Feature = VALID_FEATURES.includes(rawFeature as Feature)
    ? (rawFeature as Feature)
    : 'general'

  const store = getStore()
  if (!store) {
    return NextResponse.json(
      { error: 'Store data unavailable' },
      { status: 503 },
    )
  }

  const featureDesc = FEATURE_DESCRIPTIONS[feature]

  const contextLine =
    context != null
      ? `\n\nAdditional user-provided context:\n${JSON.stringify(context)}`
      : ''

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: buildSystemPrompt(featureDesc, store) + contextLine,
    },
  ]

  // ── Append conversation history ────────────────────────────
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history) {
      if (h.role === 'user' || h.role === 'assistant') {
        messages.push({
          role: h.role,
          content: h.content,
        })
      }
    }
  }

  // ── Append the current user message ───────────────────────
  messages.push({ role: 'user', content: message })

  try {
    const reply = await callGLM(messages)
    return NextResponse.json({ reply, model: MODEL })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Ilmu AI]', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}