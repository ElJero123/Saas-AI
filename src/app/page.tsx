import { UserRepository } from "@/repository/user-repository"
import { getToken } from "@/token/token"
import Link from "next/link"

export default async function Home() {
  const token = await getToken()
  const dbRes = await UserRepository.getChats(token?.id)
  
  const chatId = Array.isArray(dbRes) ? dbRes[0].chat_id : ''

  return (
    <main className="flex flex-wrap justify-between items-start h-screen p-4">
      <section>
        <h1 className="text-8xl max-w-[500px] font-bold">Use AI tools today</h1> <br />
        <p className="text-2xl font-bold">The better AI service what can you find</p>
        <p className="mt-3 text-2xl max-w-[600px]">
          We have AI tools what can help you
          with the today tasks and your routine
        </p>
      </section>
      <section className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl">Use the chat for simple tasks</h2>
        Go to The Chat - Free Trial
        <Link href={`/chat/${chatId}`}>
          <button className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200 mt-2">
            Chat
          </button>
        </Link>
        {token?.membership === 'premium' &&
          <div>
            TextToSpeech - Premium Plan <br />
            <Link href={`/text-to-speech`}>
              <button className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200 mt-2">
                Text To Speech
              </button>
            </Link>
          </div>
        } 
      </section>
    </main>
  )
}
