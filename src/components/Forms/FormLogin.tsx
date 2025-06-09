"use client"

import { fetchLoginUser } from "@/lib/fetchs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function FormLogin() {
    const [user, setUser] = useState<{ email: string, password: string }>({ email: '', password: '' })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const res = await fetchLoginUser(user.email, user.password)

        if (res.ok) {
            toast.success('Log in completed')
            setUser({ email: '', password: '' })
            location.reload()
            router.push('/')
        } else {
            toast.error('Failed to login, incorrect password or this email don´t exists')
            setUser({ email: '', password: '' })
        }
    }

    return (
        <form className="mt-2 flex flex-col items-center justify-center gap-2 w-full" onSubmit={handleSubmit}>
            <input
            onChange={(e) => setUser(prev => (
                { ...prev, email: e.target.value }
            ))}
            value={user.email} 
            placeholder="type your email" 
            type="text" 
            className={`bg-white w-3/4 outline-1 focus:outline-sky-400 
            hover:outline-sky-400 h-10 rounded-md text-black p-2 ease-in-out`} />
            
            <input
            onChange={(e) => setUser(prev => (
                { ...prev, password: e.target.value }
            ))}
            value={user.password} 
            placeholder="type your password" 
            type="password" 
            className={`bg-white w-3/4 outline-1 focus:outline-sky-400 
            hover:outline-sky-400 h-10 rounded-md text-black p-2 ease-in-out`} />
            
            <button
            type="submit" 
            className={`bg-white text-black w-3/4 p-2 
            mt-2 rounded-md hover:bg-gray-100 ease-in-out 
            outline-1 hover:outline-sky-400`}>Submit</button>
            <p className="text-gray-500">Don´t you have an account? <Link href="/register" className="text-blue-500 hover:underline">Sign up</Link></p>
        </form>
    )
}