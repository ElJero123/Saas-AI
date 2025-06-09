import Audio from "@/components/Audios/Audio"
import ListAudios from "@/components/Audios/ListAudios"
import { getToken } from "@/token/token"

export default async function Page() {
    const token = await getToken()
    
    if (!token || token.membership !== 'premium') return <h1>404 Not Logged or No premium actived</h1>
    else return (
        <main className="w-full min-h-[100vh] flex items-center justify-center">
            <section className={`
                flex flex-col justify-between
                w-2/3 bg-neutral-900 h-[500px] md:h-[700px]
                my-5 rounded-md mb-25
            `}>
                <Audio userId={token.id}/>
                <ListAudios userId={token.id}/>
            </section>
        </main>
    )
}