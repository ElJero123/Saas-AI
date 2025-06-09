import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await req.json()

    try {
        const sub = await UserRepository.getSubById(userId)
        return NextResponse.json({ sub, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User not found')) return NextResponse.json({ error: e.message }, { status: 404 })
        }
    
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}