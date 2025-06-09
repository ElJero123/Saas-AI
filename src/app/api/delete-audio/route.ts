import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
    const { audioId } = await req.json()

    try {
        const dbRes = await UserRepository.deleteAudioById(audioId)
        return NextResponse.json({ message: dbRes, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('Audio ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('Audio not found')) return NextResponse.json({ error: e.message }, { status: 404 })
        }
    
        return NextResponse.json({ message: `Error deleting audio, ${e}` }, { status: 500 })
    }
}