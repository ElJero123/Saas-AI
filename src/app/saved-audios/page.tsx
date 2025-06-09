import ListAudios from "@/components/Audios/ListAudios";
import { getToken } from "@/token/token";

export default async function Page() {
    const token = await getToken()

    if (!token) {
        return <p className="text-center text-2xl font-bold">You need to be logged in to see this page</p>
    }   else return (
        <main className="w-full min-h-[700px] flex items-center justify-center m-0 p-0">
            <ListAudios userId={token.id} isSavedAudios={true}/>
        </main>
    )
}