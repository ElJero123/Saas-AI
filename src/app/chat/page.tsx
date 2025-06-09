import { UserRepository } from "@/repository/user-repository"
import { getToken } from "@/token/token"
import Link from "next/link"

export default async function Page() {
    const token = await getToken()
    const dbRes = await UserRepository.getChats(token?.id ?? '')

    const chatId = Array.isArray(dbRes) ? dbRes[0].chat_id : ''

    if (!token) return <h1>not Logged, you can log in, in /login page</h1>
    else return (
        <main className="text-center w-full min-h-screen flex items-center justify-center font-bold text-2xl">
            <h1>
                <Link href={`/chat/${chatId}`} className="bg-white rounded-md text-black p-2 hover:bg-gray-200 ease-in-out">Go to Chats</Link>
            </h1>
        </main>
    )
}