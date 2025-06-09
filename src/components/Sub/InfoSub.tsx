"use client"

import { fetchCancelSub, fetchRenewSub, fetchSub } from "@/lib/fetchs"
import { Sub } from "@/types/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BtnCancelSub from "../Btns/BtnCancelSub"
import BtnRenewSub from "../Btns/BtnRenewSub"

export default function InfoSub ({ userId }: { userId: string }) {
    const [sub, setSub] = useState< Sub | undefined >()
    const [isLoading, setIsLoading] = useState(true)
    
    const handleCancel = async () => {
        const res = await fetchCancelSub(userId)

        if (res.message) {
            toast.success(res.message)
            location.reload()
        } else if (res.error) {
            toast.error(res.error)
        }
    }

    const handleRenew = async () => {
        const res = await fetchRenewSub(userId)

        if (res.message) {
            toast.success(res.message)
            location.reload()
        } else if (res.error) {
            toast.error(res.error)
        }
    }

    useEffect(() => {
        const getSub = async () => {
            const sub = await fetchSub(userId)
            setSub(sub.sub)
            setIsLoading(false)       
        }
    
        getSub()
    }, [userId])
    
    console.log(isLoading)

    if (!sub && !isLoading) return <h1 className="text-center text-2xl text-white">You don´t have a subscription</h1>
    else if (isLoading) return <h1 className="text-center text-2xl text-white mt-5">Loading...</h1>
    else return (
        <main className="flex flex-col gap-6">
            <div className="w-full">
                {sub?.stripe_status_sub === 'active' && sub.stripe_cancel_at_period_end === false ?
                    <BtnCancelSub handleCancel={handleCancel} />
                    : <div className="w-full">
                        <p className="font-bold mb-2">Sub canceled or sub is one payment</p>
                        <BtnRenewSub handleRenew={handleRenew} />
                    </div>
                } 
            </div>
            
            <h1 className="text-lg underline font-bold">Subscription Info: </h1>
            <section className="flex flex-col gap-2">
                <p>{sub?.stripe_cancel_at_period_end === false ? 'Next Payment sub Date' : 'Expiration Date'}: <br />
                    <span className="font-bold">{sub?.stripe_period_end}</span>
                </p>
                <p>Subscription status: <span className="font-bold">{sub?.stripe_status_sub}</span></p>
                {sub?.stripe_cancel_at_period_end === false && sub.stripe_status_sub === 'active' ?
                    <p className="text-green-500 font-bold">Subscription will not be canceled at the end of the period.</p>
                    : <p className="text-red-500 font-bold">Subscription will be canceled at the end of the period.</p>
                }
            </section>  
        </main>
        
    )
}