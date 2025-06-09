export type JwtTokenDecoded = {
    id: string
    name: string
    email: string
    membership: string
    iat: number
    exp: number
}

export type Message = {
    chat_id: string
    user_id: string
    content: string
    username: string
    created_at: string
    email: string
    message_id: string
    role: string
}

export type Sub = {
    user_id: string
    stripe_subscription_id: string
    stripe_customer_id: string
    stripe_status_sub: string
    stripe_period_end: string
    stripe_cancel_at_period_end: boolean
}

export type ObjAudio = {
    user_id: string
    audio_id: string
    created_at: string
    audio: {
        type: string
        data: ArrayBufferLike
    }
    url?: string
}