"use client"

import { fetchMessages, sendMessage } from "@/lib/fetchs"
import { JwtTokenDecoded, Message } from "@/types/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Chat({ token, chatId }: { token: JwtTokenDecoded, chatId?: string }) {
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState< Message[] >([])
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [loadingSend, setLoadingSend] = useState(false)
    const [disableBtn, setDisableBtn] = useState(false)
    const { name, email, id } = token


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setDisableBtn(true)
        setLoadingSend(true)
        if (!message) return toast.error('Please enter a message')
        const res = await sendMessage(message, name, id, email, chatId ?? '')

        if (res.message) {
            toast.error('Your message was not sent, please try again')
            setMessage('')
        } else if (res.status === 201) {
            toast.success('Your message was sent')
            const updateMessages = await fetchMessages(chatId!, token.id)

            if (updateMessages.status === 200) {
                setMessages(updateMessages.messages)
                setMessage('')
            } else {
                toast.error('Error fetching messages')
            }

            setLoadingSend(false)
            setMessage('')
        } else {
            toast.error(res.error)
            setMessage('')
        }

        setDisableBtn(false)
        setLoadingSend(false)
    }

    useEffect(() => {
        setLoadingMessages(true)
        const getMessages = async () => {
            const data = await fetchMessages(chatId!, token.id)
            
            if (data.status === 200) {
                setMessages(data.messages)
                setLoadingMessages(false)
            } else {
                toast.error('Error fetching messages')
            }
        }

        getMessages()
        
    }, [chatId, token.id])


    return (
        <section className={`
            w-full h-full flex-1
            flex flex-col justify-end
        `}>
            <section className="flex-1 pt-2">
                <h1 className="text-2xl font-bold text-center">
                    Chat 
                    <span className="text-sm font-normal ml-10">
                        {loadingSend && 'Sending message...'}
                    </span>
                </h1>
                
                {!chatId && <h1>Not Chat selected</h1>}
                <aside className="flex flex-col-reverse gap-2 mt-4 overflow-y-auto scrollbar-custom h-[600px] w-full">
                    <ul className="p-2 flex flex-col gap-2">
                    {loadingMessages && <p className="text-center">Loading messages...</p>}
                        {messages.map((message, i) => (
                            <li key={i + 1} className={`
                                ${message.role === 'assistant' && 'bg-neutral-700 self-end'}
                                p-2 rounded-md w-3/7 outline-1 outline-neutral-400 break-words
                            `}>
                                {message.role === 'user' ? <p className="font-bold underline">{message.username}: </p> : <p className="font-bold underline">{message.role}: </p>}
                                {message.content}
                            </li>
                        ))}  
                    </ul>
                </aside>
            </section>
            <form className="w-full flex justify-center gap-2 px-3 py-1" onSubmit={handleSubmit}>

                <input type="text" className={`
                    bg-transparent outline-1 outline-white hover:outline-blue-400
                    rounded-md ease-in-out h-9 w-3/4 p-2  
                `}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder={loadingSend ? 'Sending message...' : 'Type your message here'}
                />

                <button 
                className={`
                    bg-white text-black p-2 w-1/4 h-9
                    rounded-md hover:bg-gray-100 ease-in-out 
                    outline-1 hover:outline-sky-400
                `}
                type="submit"
                disabled={disableBtn}>
                    Send
                </button>
            </form>
        </section>
    )
}