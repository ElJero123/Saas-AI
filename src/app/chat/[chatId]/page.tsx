import Chat from "@/components/Chats/Chat"
import ListChats from "@/components/Chats/ListChats"
import { getToken } from "@/token/token"

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
    const token = await getToken()
    const { chatId } = await params

    if (!token) return <h1>not Logged, you can log in, in /login page</h1>
    else {
      return (
            <main className="w-full min-h-[100vh] flex items-center justify-center">
                <section className={`
                    flex flex-col 
                    w-3/4 bg-neutral-900 md:h-[700px] h-fit
                    my-5
                    rounded-md md:grid md:grid-cols-[auto_1fr] 
                `}>
                    <ListChats token={token} />
                    <Chat token={token} chatId={chatId}/>
                </section>
            </main>
        )  
    }
}

// hoy vamos a continuar en la interfaz del chat, y vamos a agregarla para que funcione
