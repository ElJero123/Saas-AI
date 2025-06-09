import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await req.json()

    try {
        const audios = await UserRepository.getAudiosById(userId)
        return NextResponse.json({ audios, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('Audio not found')) return NextResponse.json({ error: e.message }, { status: 404 })
        }

        return NextResponse.json({ message: `Server error, ${e}` }, { status: 500 })
    }
}