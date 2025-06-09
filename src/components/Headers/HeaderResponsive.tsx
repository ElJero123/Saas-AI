"use client"

import { Cog6ToothIcon, CreditCardIcon, HomeIcon, MicrophoneIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

export default function HeaderResponsive({ membership }: { membership: string }) {
    const toggleMenu = () => {
        const menu = document.getElementById("mobile-menu")
        const button = document.getElementById("menu-btn")

        if (menu && button) {
            if (menu.classList.contains("hidden")) {
                menu.classList.remove("hidden")
                menu.classList.add("flex")
                menu.classList.add("flex-wrap")
            } else {
                menu.classList.add("hidden")
            }
        }
    }


    return (
        <section className="md:hidden flex gap-5 items-center justify-center">
            <h1 >Membership: <span>{membership}</span></h1>
            <button onClick={() => toggleMenu()} id="menu-btn" className="md:hidden text-2xl focus:outline-none">
                ☰
            </button>

            <nav id="mobile-menu" className="hidden flex-row w-30 bg-gray-800 rounded-md text-white md:hidden gap-2">
                <Link href={'/'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                    <HomeIcon className="w-5 h-5 font-bold" />
                </Link>
                <Link href={'/settings'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                    <Cog6ToothIcon className="w-5 h-5 font-bold"/>
                </Link>
                <Link href={'/saved-audios'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                    <MicrophoneIcon className="w-5 h-5 font-bold"/>
                </Link>
                {membership === 'free' && 
                    <Link href={'/subscribe'} className="flex flex-wrap gap-2 items-center text-black bg-white px-4 py-1 rounded hover:bg-gray-200">
                        <CreditCardIcon className="w-5 h-5 font-bold"/>
                    </Link> 
                }
                
            </nav>
        </section>
    )
}