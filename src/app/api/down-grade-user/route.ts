import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { userId } = await req.json()

    try {
        await UserRepository.downgradeUser(userId)
        return NextResponse.json({ message: 'User downgraded successfully' }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User not found')) return NextResponse.json({ error: e.message }, { status: 404 })
            if (e.message.includes('User ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
        }

        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}