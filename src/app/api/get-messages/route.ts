import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { chatId, userId } = await req.json()

    try {
        const messages = await UserRepository.getMessagesById(chatId, userId)
        return NextResponse.json({ messages, status: 200 }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}