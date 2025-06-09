import { ElevenLabsClient } from "elevenlabs"
import { ELEVENLABS_TOKEN } from "../../../../config/config"
import { NextResponse } from "next/server"
import { Readable } from "stream"
import type { ReadableStream } from 'stream/web'
import { UserRepository } from "@/repository/user-repository"


const elevenlabs = new ElevenLabsClient({ 
    apiKey: ELEVENLABS_TOKEN
})

export async function POST(req: Request) {
    try {
        const { text, userId } = await req.json()
        const audioStream = await elevenlabs.generate({
            voice: "Sarah",
            text,
            model_id: "eleven_multilingual_v2"
        })

        const streamWeb: ReadableStream = (audioStream as unknown) as ReadableStream
        const nodeStream = Readable.fromWeb(streamWeb)
        
        const audio = await UserRepository.saveAudio(userId, nodeStream)

        return NextResponse.json({ audio, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('Audio stream is required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('User ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
        }
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}
