import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { name, email, password } = await req.json()

    try {
        const res = await UserRepository.createUser(name, email, password)
        return NextResponse.json({ message: res, status: 201 }, { status: 201 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('Name, email and password are required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('User with this email already exists')) return NextResponse.json({ error: e.message }, { status: 409 })
        }
    
        return NextResponse.json({ message: `server error, ${e}` }, { status: 500 })
    }
}