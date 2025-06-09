"use client"

import { fetchCheckout } from "@/lib/fetchs"

export default function BtnCheckout({ userId }: { userId?: string }) {
    const handleCheckout = async (cancelAtPeriodEnd: boolean) => {
        if (!userId) return
        const url = await fetchCheckout(userId, cancelAtPeriodEnd)
        if (url.url) {
            window.location.href = url.url
        }
    }

    return (
        <section className="flex flex-col items-center justify-center p-4 text-white">
            <h1>Pagar suscripcion</h1>
            <button onClick={() => handleCheckout(false)} className="bg-white text-black p-2 mt-2 rounded-md">Pago automatico cada mes</button>
            <button onClick={() => handleCheckout(true)} className="bg-white text-black p-2 mt-2 rounded-md">Un solo pago</button>
        </section>
    )
}