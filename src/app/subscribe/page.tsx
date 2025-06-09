import BtnCheckout from "@/components/Btns/BtnCheckout";
import { getToken } from "@/token/token";

export default async function Page() {
    const token = await getToken()

    if (token?.membership === 'premium') {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4">
                <section className="flex flex-col items-center justify-evenly w-full max-w-sm h-[400px] p-4 text-white">
                    <h2 className="text-3xl font-bold">You`ve a subscription</h2>
                    <p className="text-2xl font-bold">Thank you for your support</p>
                </section>
            </main>
        )
    }
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <section className="flex flex-col items-center justify-evenly w-full max-w-sm h-[400px] p-4 bg-neutral-900 text-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold">Plan Mensual</h2>
                <p className="text-2xl font-bold">Info de la membresia</p>
                <ul className="flex flex-col gap-4 mt-4">
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">Precio:</span>
                        <span>$4.99</span>
                    </li>
                    <li className="flex gap-2 items-center">
                        <span className="font-bold">Duracion:</span>
                        <span>1 Mes</span>
                    </li>
                </ul>
                <BtnCheckout userId={token?.id}/>
            </section>
        </main>
    )
}