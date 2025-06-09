import { InferenceClient } from "@huggingface/inference"
import { HF_API_KEY } from "../../../../config/config"
import { NextResponse } from "next/server"
import { UserRepository } from "@/repository/user-repository"

const client = new InferenceClient(HF_API_KEY)

// Este endpoint sirve para guardar mensajes en la base de datos

export async function POST(req: Request) {
    const { message, name, userId, email, chatId } = await req.json()
    
    try {
        const res = await client.chatCompletion({
            provider: "novita",
            model: "deepseek-ai/DeepSeek-V3-0324",
            messages: [{
                role: "user",
                content: message
            }]
        })
        
        
        const userResponse = await UserRepository.saveMessage(message, name, userId, email, chatId, 'user')
        const assistantResponse = await UserRepository.saveMessage(res.choices[0].message.content ?? '', `${name}'s Prompt`, userId, email, chatId, 'assistant')

        return NextResponse.json({ userMessage: userResponse, assistantMessage: assistantResponse, status: 201 }, { status: 201 })
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.includes('User ID is required')) return NextResponse.json({ error: e.message }, { status: 400 })
            if (e.message.includes('Audio stream is required')) return NextResponse.json({ error: e.message }, { status: 400 })
        } 
    
        return NextResponse.json({ message: `Server Error, ${e}` }, { status: 500 })
    }
}
