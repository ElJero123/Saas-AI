import { jwtVerify, SignJWT } from 'jose'
import { REFRESH_KEY } from "../config/config"
import { JwtTokenDecoded } from "./types/types"
import { NextRequest, NextResponse } from "next/server"

export async function middleware (req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get('refresh_token')?.value
    const res = NextResponse.next()

    if (!token) return res
    const refreshKey = new TextEncoder().encode(REFRESH_KEY ?? '') 

    const { payload } : { payload: JwtTokenDecoded } = await jwtVerify(token ?? '', refreshKey)


    if (pathname.startsWith('/settings')) {
        try {
            const newRefreshToken = await new SignJWT({
                id: payload.id,
                email: payload.email,
                name: payload.name,
                membership: payload.membership
            }).setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(refreshKey)


            res.cookies.set('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })

            return res
        } catch {
            return res
        }  
    }

    if (pathname.startsWith('/success-subscription')) {
        try {
            const subRes = await fetch(`${req.nextUrl.origin}/api/get-sub`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ userId: payload.id })
            })

            const subUser = await subRes.json()

            if (subUser.sub) {
                const newRefreshToken = await new SignJWT({
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                    membership: 'premium'
                }).setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('7d')
                .sign(refreshKey)


                res.cookies.set('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7
                })

                return res
            }

            return res
        } catch {
            return res
        }
    }

    if (pathname.startsWith('/')) {
        if (payload.membership !== 'premium') return res

        const subRes = await fetch(`${req.nextUrl.origin}/api/get-sub`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ userId: payload.id })
        })

        const subUser = await subRes.json()

        const datePeriodEnd = new Date(subUser.sub.stripe_period_end)
        const activePeriodEnd = new Date(subUser.sub.stripe_period_end).getTime() + 1000 * 60 * 60 * 24 * 3 

        const isExpired = subUser.sub.stripe_status_sub === 'canceled' && new Date().getTime() > datePeriodEnd.getTime()
        const isExpiredActive = subUser.sub.stripe_status_sub === 'active' && new Date().getTime() > new Date(activePeriodEnd).getTime()
        

        if (isExpired || isExpiredActive) {
            await fetch(`${req.nextUrl.origin}/api/down-grade-user`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ userId: payload.id })
            })

            const newRefreshToken = await new SignJWT({
                id: payload.id,
                email: payload.email,
                name: payload.name,
                membership: 'free'
            }).setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(refreshKey)

            res.cookies.set('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })

            return res
        }

        return res
    }
    
    return res
}

export const config = {
    matcher: ['/settings', '/success-subscription', '/']
}
