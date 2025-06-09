import Stripe from "stripe"
import { REFRESH_KEY, STRIPE_API_KEY, STRIPE_WEBHOOK_KEY } from "../../../../config/config"
import { NextResponse } from "next/server"
import { UserRepository } from "@/repository/user-repository"
import { cookies, headers } from "next/headers"
import { getToken } from "@/token/token"
import { SignJWT } from "jose"

const stripe = new Stripe(STRIPE_API_KEY ?? '')

export async function POST(req: Request) {
    const rawBody = await req.text()
    const header = await headers()
    const signature = header.get('stripe-signature')
    let event

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature ?? '', STRIPE_WEBHOOK_KEY ?? '')
    } catch {
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        if ('metadata' in event.data.object) {
            const metadata = (event.data.object).metadata

            if (!metadata || Object.keys(metadata).length === 0) return NextResponse.json({ error: 'No metadata found' }, { status: 400 })           
        }

        const session = event.data.object
        const subscriptionId = session.subscription
        const customerId = session.customer
        const subscription = await stripe.subscriptions.retrieve(subscriptionId! as string)
        const cancelAt = new Date(subscription.items.data[0].current_period_end * 1000).toISOString()

        try {
            const refreshKey = new TextEncoder().encode(REFRESH_KEY ?? '')
            const userId = session.metadata?.userId
            const cancelAtPeriodEnd = JSON.parse(session.metadata?.cancelAtPeriodEnd ?? 'false')
            const dbRes = await UserRepository.changeMembershipFree(userId, subscriptionId, cancelAt!, customerId, cancelAtPeriodEnd)

            await stripe.subscriptions.update(subscriptionId! as string, {
                cancel_at_period_end: cancelAtPeriodEnd
            })

            const token = await getToken()
            const cookieStore = await cookies()

            const newToken = await new SignJWT({
                id: token?.id,
                name: token?.name,
                email: token?.email,
                membership: 'premium'
            }).setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(refreshKey)

            cookieStore.delete('refresh_token')

            cookieStore.set('refresh_token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7
            })

            return NextResponse.json({ message: dbRes }, { status: 200 })
        } catch (e) {
            return NextResponse.json({ error: `Error updating membership, ${e}` }, { status: 500 })
        }
    }

    if (event.type === 'invoice.paid') {
        try {
            const invoice = event.data.object
            const customerId = invoice.customer
            const expTimeCancel = invoice.period_end
        
            const sub = await UserRepository.paymentSubSuccess(customerId, expTimeCancel)
            
            return NextResponse.json({ sub }, { status: 200 })
        } catch (e) {
            return NextResponse.json({ error: `Error updating membership, ${e}` }, { status: 500 })
        }
    }

    if (event.type === 'invoice.payment_failed') {
        try {
            const invoice = event.data.object
            const customerId = invoice.customer

            const message = await UserRepository.paymentSubFailed(customerId)
            
            return NextResponse.json({ message }, { status: 200 })
        } catch (e) {
            return NextResponse.json({ error: `Error updating membership, ${e}` }, { status: 500 })
        }
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
}