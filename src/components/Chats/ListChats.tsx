"use client"

import { fetchAddChat, fetchChats, fetchDeleteChat } from "@/lib/fetchs"
import { JwtTokenDecoded } from "@/types/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ListChats({ token }: { token: JwtTokenDecoded }) {
    const router = useRouter()
    const [chats, setChats] = useState<{ chat_id: string, user_id: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return
        const getChats = async () => {
            const data = await fetchChats(token.id)

            if (data.status === 200) {
                setChats(data.chats)
                setLoading(false)
            } else {
                toast.error('Error fetching chats')
            }
        }
    
        getChats()
    }, [token.id, token])

    const handleAddChat = async () => {
        const data = await fetchAddChat(token.id)
        if (data.status === 200) {
            setChats(data.chats)
        } else {
            toast.error('Error adding chat')
        }
    }

    const handleDeleteChat = async (chatId: string) => {
        if (chats.length === 1) {
            toast.error('You must have at least one chat')
            return
        }

        const data = await fetchDeleteChat(chatId)
        if (data.status === 200) {
            setChats(data.chats)
            router.push(`/chat/${data.chats[0].chat_id}`)
        } else {
            toast.error('Error deleting chat')
        }
    }

    
    return (
        <section className="bg-black/70 py-2 px-4 rounded-l-md">
            <h1 className="font-bold text-2xl">Saas AI Chat</h1>
            <button className="my-2 bg-white text-black p-2 rounded-md hover:bg-gray-200 ease-in-out" onClick={() => handleAddChat()}>
                Add new Chat
            </button>
            <h1 className="underline">Saved Chats</h1>
            <ul className="flex flex-col justify-center items-start mt-4 gap-4">
                {loading && <p>Cargando...</p>}
                {chats.length === 0 && !loading && <p>No chats found</p>}
                {chats.map((chat, i) => (
                    <li key={`${chat.chat_id}${i}`} className="w-full flex justify-between items-center p-2 outline-1 outline-neutral-400 rounded-lg">
                        <Link href={`/chat/${chat.chat_id}`}>
                            chat {i + 1}
                        </Link>
                        <button className="p-2 rounded-md hover:outline-1 hover:outline-red-500 ease-in-out" onClick={() => handleDeleteChat(chat.chat_id)}>
                            <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}