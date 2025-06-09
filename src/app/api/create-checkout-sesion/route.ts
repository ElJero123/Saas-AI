import Stripe from 'stripe'
import { LOCAL_URL, STRIPE_API_KEY, STRIPE_PRICE_ID } from '../../../../config/config'
import { NextResponse } from 'next/server'

const stripe = new Stripe(STRIPE_API_KEY ?? '')

export async function POST(req: Request) {
    const { userId, cancelAtPeriodEnd } = await req.json()

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            metadata: {
                userId,
                cancelAtPeriodEnd: cancelAtPeriodEnd ? 'true' : 'false'
            },
            success_url: `${LOCAL_URL}/success-subscription`,
            cancel_url: `${LOCAL_URL}/cancel-subscription`,
        }) 
        
        return NextResponse.json({ url: session.url, status: 201 }, { status: 201 })
    } catch (e) {
        if (e instanceof Error) {
            if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }
        return NextResponse.json({ error: `Error creating checkout session, ${e}` }, { status: 500 })
    }
}