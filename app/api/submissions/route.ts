import { NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json')

type SubmissionType = 'inquiry' | 'complaint' | 'suggestion'

interface Submission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}

interface Store {
  inquiries: Submission[]
  complaints: Submission[]
  suggestions: Submission[]
}

const KEY_MAP: Record<SubmissionType, keyof Store> = {
  inquiry: 'inquiries',
  complaint: 'complaints',
  suggestion: 'suggestions',
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { inquiries: [], complaints: [], suggestions: [] }
  }
}

async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2))
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') as SubmissionType | null
  const store = await readStore()

  if (type && KEY_MAP[type]) {
    return Response.json(store[KEY_MAP[type]])
  }

  return Response.json(store)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, name, email, phone = '', subject, message } = body

  if (!type || !KEY_MAP[type as SubmissionType]) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const submission: Submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email,
    phone,
    subject: subject || '',
    message,
    createdAt: new Date().toISOString(),
  }

  const store = await readStore()
  store[KEY_MAP[type as SubmissionType]].push(submission)
  await writeStore(store)

  return Response.json({ success: true, id: submission.id }, { status: 201 })
}
