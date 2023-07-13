import { NextResponse } from 'next/server'

export async function GET() {
  const res = {
    ab: 1
  }
 
  return NextResponse.json({ data: res })
}