import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await req.json()

    try {
        const data = await UserRepository.addChat(userId)
        return NextResponse.json({ chats: data, status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User ID is required')) return NextResponse.json({ message: e.message, status: 400 })
            if (e.message.includes('User not found')) return NextResponse.json({ message: e.message, status: 404 })
        } else return NextResponse.json({ message: `Server Error, ${e}`, status: 500 })
    }
}

export async function DELETE(req: Request) {
    const { userId } = await req.json()

    try {
        const data = await UserRepository.deleteChat(userId)
        return NextResponse.json({ chats: data, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('Chat ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('Chat not found')) return NextResponse.json({ error: e.message }, { status: 404 })
        } 
    
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}