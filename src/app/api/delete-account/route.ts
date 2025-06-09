import { UserRepository } from "@/repository/user-repository"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
    const { userId } = await req.json()

    try {
        const cookie = await cookies()
        cookie.delete('refresh_token')
        const dbRes = await UserRepository.deleteAccountById(userId)

        return NextResponse.json({ message: dbRes, status: 200 }, { status: 200 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User not found')) return NextResponse.json({ error: e.message, status: 404 }, { status: 404 })
            if (e.message.includes('User ID is required')) return NextResponse.json({ error: e.message, status: 400 }, { status: 400 })
            
            return NextResponse.json({ error: e.message, status: 500 }, { status: 500 })
        }
    }
}