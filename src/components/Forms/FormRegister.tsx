"use client"

import { fetchRegisterUser } from "@/lib/fetchs"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function FormRegister() {
    const [user, setUser] = useState<{ name: string, email: string, password: string, confirmPassword: string}>
    ({
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    })

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { name, email, password, confirmPassword } = user

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            setUser({ ...user, password: '', confirmPassword: '' })
            return
        } else {
            const res = await fetchRegisterUser(name, email, password)
            if (res.status === 201) {
                toast.success(res.message)
            } else if (res.status === 400) {
                toast.error(res.error)
            } else if (res.status === 409) {
                toast.error(res.error)
            } else {
                toast.error(res.message)
            }
            
            setUser({ name: '', email: '', password: '', confirmPassword: '' })
        }
    }

    return (
        <form className="mt-2 flex flex-col items-center justify-center gap-2 w-full" onSubmit={handleRegister}>
            <input 
            placeholder="type your email"
            type="text"
            className={`bg-white w-3/4 outline-1
            focus:outline-sky-400 hover:outline-sky-400 
            h-10 rounded-md text-black p-2 ease-in-out`}
            onChange={(e) => setUser(prev => (
                { ...prev, email: e.target.value }
            ))} 
            value={user.email}/>

            <input 
            placeholder="type your username"
            type="text"
            className={`bg-white w-3/4 outline-1 
            focus:outline-sky-400 hover:outline-sky-400 
            h-10 rounded-md text-black p-2 ease-in-out`} 
            onChange={(e) => setUser(prev => (
                { ...prev, name: e.target.value }
            ))} 
            value={user.name}/>

            <input 
            placeholder="type your password"
            type="password"
            className={`bg-white w-3/4 outline-1 
            focus:outline-sky-400 hover:outline-sky-400 
            h-10 rounded-md text-black p-2 ease-in-out`} 
            onChange={(e) => setUser(prev => (
                { ...prev, password: e.target.value }
            ))} 
            value={user.password}/>

            <input 
            placeholder="confirm your password"
            type="password"
            className={`bg-white w-3/4 outline-1 
            focus:outline-sky-400 hover:outline-sky-400 
            h-10 rounded-md text-black p-2 ease-in-out`} 
            onChange={(e) => setUser(prev => (
                { ...prev, confirmPassword: e.target.value }
            ))} 
            value={user.confirmPassword}/>
            
            <button 
            className={`bg-white text-black w-3/4 p-2 mt-2 
            rounded-md hover:bg-gray-100 ease-in-out outline-1 
            hover:outline-sky-400`}>Submit</button>

            <p className="text-gray-500">Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link></p>
        </form>
    )
}