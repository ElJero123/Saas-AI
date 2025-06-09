import { UserRepository } from "@/repository/user-repository"
import { NextResponse } from "next/server"
import { ACCESS_KEY, REFRESH_KEY } from "../../../../config/config"
import { cookies } from "next/headers"
import { SignJWT } from "jose"


export async function POST(req: Request) {
    const { email, password } = await req.json()
    
    try {
        const accessKey = new TextEncoder().encode(ACCESS_KEY ?? '')
        const refreshKey = new TextEncoder().encode(REFRESH_KEY ?? '')
        const user = await UserRepository.loginUser(email, password)
        
        const accessToken = await new SignJWT({
            id: user.id,
            name: user.name,
            email: user.email,
            membership: user.membership 
        }).setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(accessKey)

        const refreshToken = await new SignJWT({
            id: user.id,
            name: user.name,
            email: user.email,
            membership: user.membership 
        }).setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(refreshKey)

        const cookieStore = await cookies()

        cookieStore.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
        })

        return NextResponse.json({ user, accessToken, status: 201 }, { status: 201 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User with this email doesn´t exist')) return NextResponse.json({ error: e.message }, { status: 404 })
            if (e.message.includes('Password is incorrect')) return NextResponse.json({ error: e.message }, { status: 401 })
        }
    
        return NextResponse.json({ message: `Server error, ${e}` }, { status: 500 })
    }
}