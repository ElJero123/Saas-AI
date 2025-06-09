import { validateMessage, validateSubscription, validateUser } from "@/schema/schema"
import { neon } from "@neondatabase/serverless"
import bcrypt from 'bcrypt'
import Stripe from "stripe"
import { STRIPE_API_KEY } from "../../config/config"
import Stream from "stream"

const sql = neon(process.env.DATABASE_URL ?? '')
const stripe = new Stripe(STRIPE_API_KEY!)

export class UserRepository {
    static async createUser(name: string, email: string, password: string) {
        if (!name || !email || !password) throw new Error('Name, email and password are required')
            
        const user = { name, email, password }
        const result = await validateUser(user)

        if (result.error) throw new Error(result.error.message)

        const [userExists] = await sql`SELECT * FROM users WHERE email = ${email}`

        if (userExists) throw new Error('User with this email already exists')

        const hashedPassword = await bcrypt.hash(password, 10)

        await sql`
            INSERT INTO users (name, email, password)
            VALUES (${result.data?.name}, ${result.data?.email}, ${hashedPassword})
        `

        return 'User created successfully'
    }

    static async loginUser(email: string, password: string) {
        const [user] = await sql`
            SELECT * FROM users WHERE email = ${email}
        `

        if (!user) throw new Error ('User with this email doesn´t exist')

        const isCorrectPassword = bcrypt.compare(password, user.password)

        if (!isCorrectPassword) throw new Error('Password is incorrect')

        const [chat] = await sql`SELECT * FROM chats WHERE user_id = ${user.id}`

        if (!chat) {
            await sql`INSERT INTO chats (user_id) VALUES (${user.id})`
        }

        const publicUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            membership: user.membership
        }

        return publicUser
    }

    static async saveMessage(message: string, name: string, userId: string, email: string, chatId: string, role: string) {
        const result = await validateMessage({ message })
        const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`

        if (!user) throw new Error('User not found')

        const [chat] = await sql`SELECT * FROM chats WHERE chat_id = ${chatId}`

        if (!chat) throw new Error('Chat not found')

        await sql`
            INSERT INTO messages (chat_id, user_id, content, username, email, role)
            VALUES (${chatId}, ${userId}, ${result.data?.message}, ${name}, ${email}, ${role})
        `

        const [messages] = await sql`SELECT * FROM messages WHERE chat_id = ${chatId} AND user_id = ${userId}`

        if (messages.length === 0) return { message: 'No messages found' }
        else return messages 
    }

    static async getChats(userId?: string) {
        if (!userId) return
        const chats = await sql`SELECT * FROM chats WHERE user_id = ${userId}`

        if (!chats) return { message: 'No chats found' }
        else return chats
    }

    static async getMessagesById(chatId: string, userId: string) {
        const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chatId} AND user_id = ${userId}`

        if (!messages) return { message: 'No messages found' }
        else return messages
    }

    static async addChat(userId: string) {
        if (!userId) throw new Error('User ID is required')
        const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`

        if (!user) throw new Error('User not found')

        await sql`INSERT INTO chats (user_id) VALUES (${userId})`

        const chatId = await sql`SELECT * FROM chats WHERE user_id = ${userId}`

        return chatId
    }

    static async deleteChat(chatId: string) {
        if (!chatId) throw new Error('Chat ID is required')
        const [chat] = await sql`SELECT * FROM chats WHERE chat_id = ${chatId}`

        if (!chat) throw new Error('Chat not found')


        await sql`DELETE FROM messages WHERE chat_id = ${chatId}`
        await sql`DELETE FROM chats WHERE chat_id = ${chatId}`

        const chats = await sql`SELECT * FROM chats`

        return chats
    }

    static async changeMembershipFree(userId?: string, subId?: string | null | Stripe.Subscription, cancelAt?: string, customerId?: string | Stripe.Customer | Stripe.DeletedCustomer | null, cancelAtPeriodEnd?: boolean) {
        const result = await validateSubscription({ userId, subId, cancelAt, customerId, cancelAtPeriodEnd })
        if (result.error) throw new Error(result.error.message)
        
        const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`

        if (!user) throw new Error('User not found')

        await sql`UPDATE users SET membership = 'premium' WHERE id = ${userId}`
        await sql`
            INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_status_sub, stripe_period_end, stripe_customer_id, stripe_cancel_at_period_end) 
            VALUES (${result.data.userId}, ${result.data.subId}, 'active', ${cancelAt}, ${result.data.customerId}, ${result.data.cancelAtPeriodEnd})
        `

        return { message: `Membership changed to premium, welcome to premium ${user.name}` }
    }

    static async cancelSubscription(userId: string) {
        const [user] = await sql`SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ${userId}`
        if (!user) throw new Error('User not found')

        await sql`UPDATE subscriptions SET stripe_status_sub = 'canceled' WHERE user_id = ${userId}`
        await sql`UPDATE subscriptions SET stripe_cancel_at_period_end = true WHERE user_id = ${userId}`
        await stripe.subscriptions.update(user.stripe_subscription_id, {
            cancel_at_period_end: true
        })

        return { message: `User ${userId} Subscription canceled` }
    }

    static async renewSubscription(userId: string) {
        const [user] = await sql`SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ${userId}`
        if (!user) throw new Error('User not found')

        await sql`UPDATE subscriptions SET stripe_status_sub = 'active' WHERE user_id = ${userId}`
        await sql`UPDATE subscriptions SET stripe_cancel_at_period_end = false WHERE user_id = ${userId}`
        await stripe.subscriptions.update(user.stripe_subscription_id, {
            cancel_at_period_end: false
        })

        return { message: `User ${userId} Subscription renoved` }
    }

    static async getSubById(userId?: string) {
        if (!userId) return
        const [user] = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`

        if (!user) throw new Error('User not found')

        return user
    }

    static async downgradeUser(userId: string) {
        if (!userId) throw new Error('User ID is required')
        const [user] = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`
        if (!user) throw new Error('User not found')

        await stripe.subscriptions.cancel(user.stripe_subscription_id)

        await sql`DELETE FROM subscriptions WHERE user_id = ${userId}`
        await sql`UPDATE users SET membership = 'free' WHERE id = ${userId}`
    }

    static async paymentSubSuccess (customerId?: string | Stripe.Customer | Stripe.DeletedCustomer | null, expCancelAt?: number) {
        const [sub] = await sql`SELECT * FROM subscriptions WHERE stripe_customer_id = ${customerId}`

        if (!sub) throw new Error('Subscription not found')

        const expiresAt = new Date(expCancelAt! * 1000).toISOString().slice(0, 19).replace('T', ' ')

        await sql`UPDATE subscriptions SET stripe_period_end = ${expiresAt} WHERE stripe_customer_id = ${customerId}`
        const [updatedSub] = await sql`SELECT * FROM subscriptions WHERE stripe_customer_id = ${customerId}` 

        return updatedSub
    }

    static async paymentSubFailed (customerId?: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
        const [sub] = await sql`SELECT * FROM subscriptions WHERE stripe_customer_id = ${customerId}`

        if (!sub) throw new Error('Subscription not found')
            
        await stripe.subscriptions.cancel(sub.stripe_subscription_id)
        await sql`DELETE FROM subscriptions WHERE stripe_customer_id = ${customerId}`
        await sql`UPDATE users SET membership = 'free' WHERE id = ${sub.user_id}`

        return 'Your user has been downgraded'
    }

    static async saveAudio(userId: string, nodeStream: Stream.Readable) {
        if (!userId) throw new Error('User ID is required')
        if (!nodeStream) throw new Error('Audio stream is required')

        const chunks: Uint8Array[] = []

        for await (const chunk of nodeStream) {
            if (!Buffer.isBuffer(chunk)) {
                chunks.push(Buffer.from(chunk))
            } else {
                chunks.push(chunk)
            }
        }

        const buffer = Buffer.concat(chunks)
        
        await sql`INSERT INTO audios (user_id, audio) VALUES (${userId}, ${buffer})`

        const [audio] = await sql`SELECT audio FROM audios WHERE user_id = ${userId} AND audio = ${buffer}`

        return audio.audio
    }

    // static async getAudioById (audioId: string) {
    //     if (!audioId) throw new Error('Audio ID is required')
    //     const [audio] = await sql`SELECT * FROM audios WHERE audio_id = ${audioId}`

    //     if (!audio) throw new Error('Audio not found')

    //     return audio
    // }

    static async getAudiosById (userId: string) {
        if (!userId) throw new Error('User ID is required')
        const audio = await sql`SELECT * FROM audios WHERE user_id = ${userId}`

        if (!audio) throw new Error('Audio not found')

        return audio
    }

    static async deleteAudioById (audioId: string) {
        if (!audioId) throw new Error('Audio ID is required')
        const [audio] = await sql`SELECT * FROM audios WHERE audio_id = ${audioId}`

        if (!audio) throw new Error('Audio not found')

        await sql`DELETE FROM audios WHERE audio_id = ${audioId}`

        return { message: 'Audio deleted successfully' }
    }

    static async deleteAccountById (userId: string) {
        if (!userId) throw new Error('User ID is required')
        const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`
        const [sub] = await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`

        if (!user) throw new Error('User not found')
        if (sub) {
            await stripe.customers.del(sub.stripe_customer_id)
            await sql`DELETE FROM subscriptions WHERE user_id = ${userId}`
        }

        await sql`DELETE FROM audios WHERE user_id = ${userId}`
        await sql`DELETE FROM messages WHERE user_id = ${userId}`
        await sql`DELETE FROM chats WHERE user_id = ${userId}`
        await sql`DELETE FROM users WHERE id = ${userId}`

        return { message: 'Account deleted successfully' }
    }
}