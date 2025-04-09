import { NextResponse } from 'next/server'
import { verifyWithGemini } from '../../../../lib/verify'// assuming this is correct

export async function POST(req: Request) {
  try {
    const formData = await req.json()

    const verificationResult = await verifyWithGemini(formData)

    return NextResponse.json(verificationResult)
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
