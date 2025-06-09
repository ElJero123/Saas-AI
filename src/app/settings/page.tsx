import InfoSub from "@/components/Sub/InfoSub"
import BtnDeleteAccount from "@/components/Btns/BtnDeleteAccount"
import BtnLogout from "@/components/Btns/BtnLogout"
import { getToken } from "@/token/token"
import Link from "next/link"

export default async function Page() {
    const token = await getToken()

    if (!token) return <h1>404 Not Logged</h1>
    return (
        <main className="w-full h-full flex items-start justify-center gap-10 p-4 min-h-[calc(100vh-15rem)]">   
            <section className="flex flex-col gap-4 mt-4">
                <h1 className="text-3xl font-bold">Settings</h1>
                <h1 className="text-2xl font-bold">Info Account</h1> 
                <ul>
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">Email:</span>
                        <span>{token.email}</span>
                    </li>
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">Username:</span>
                        <span>{token.name}</span>
                    </li>
                </ul>
                <BtnLogout />
                <BtnDeleteAccount userId={token.id}/>
            </section>
            <section className="flex flex-col mt-4">
                <h1 className="text-2xl font-bold">Membership: </h1>
                <p className="text-lg font-bold">{token.membership}</p>
                {token.membership === 'free' ?
                    <div className="my-2 flex flex-col gap-2">
                        <p>You can go to Subscribe to premium membership!</p>
                        <Link href='/subscribe' className="p-2 bg-green-600 rounded-md my-2">Subscribe!</Link>  
                    </div>
                    : <h1>
                        Subscribe options:
                    </h1>
                }

                <InfoSub userId={token.id}/>
            </section>
        </main>
    )
}