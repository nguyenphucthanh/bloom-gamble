import { NextResponse, NextRequest } from 'next/server'
import axios from "axios";

export async function GET() {
  const res = {
    ab: 1
  }
 
  return NextResponse.json({ data: res })
}

export async function POST(request: NextRequest) {
  const config = await axios.get('https://lhhl.github.io/bloom-gamble/config.json')
  let slackWebhook = config?.data?.slkCode

  if (!slackWebhook) {
    return NextResponse.json({ status: 'failed', message: 'webhook url not found' })
  }

  slackWebhook = atob(slackWebhook)
  const data = await request.json()
  await axios.post(slackWebhook, {
    text: data?.text
  }, {
    headers: {
      'Content-type': 'application/json'
    }
  }).catch(err => NextResponse.json({ status: 'error', message: err?.message }))
 
  return NextResponse.json({ status: 'ok' })
}