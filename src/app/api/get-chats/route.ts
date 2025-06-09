import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await req.json()
    try {
        const chats = await UserRepository.getChats(userId)
        return NextResponse.json({ chats, status: 200 }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}