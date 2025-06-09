import { getToken } from "@/token/token"
import UserSvg from "@/ui/UserSvg"
import { Cog6ToothIcon, CreditCardIcon, HomeIcon, MicrophoneIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import HeaderResponsive from "./HeaderResponsive"

export default async function Header() {
    const token = await getToken() ?? undefined

    return (
        <header className="w-full bg-gradient-to-b from-gray-800 to-transparent text-center text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Saas AI</h1>
            {!token &&
               <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href={'/'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                home
                            </Link>
                        </li>
                        <li>
                            <Link href={'/register'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                Sign up
                            </Link>
                        </li>
                        <li>
                            <Link href={'/login'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav> 
            }

            {token &&
                <main>
                   <section className="hidden md:flex gap-5 text-lg items-center">
                        <p className="flex gap-2">Membership:<span className="font-bold">{token.membership}</span></p>
                        <p className="font-bold flex gap-2 items-center">
                            {token.name}
                            <UserSvg />
                        </p>
                        <nav className="flex gap-3">
                            <Link href={'/'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                <HomeIcon className="w-5 h-5 font-bold" />
                            </Link>
                            <Link href={'/settings'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                <Cog6ToothIcon className="w-5 h-5 font-bold"/>
                            </Link>
                            <Link href={'/saved-audios'} className="text-black bg-white px-4 py-2 rounded hover:bg-gray-200">
                                <MicrophoneIcon className="w-5 h-5 font-bold"/>
                            </Link>
                            {token.membership === 'free' &&
                                <Link href={'/subscribe'} className="flex flex-wrap gap-2 items-center text-black bg-white px-4 py-1 rounded hover:bg-gray-200">
                                    <CreditCardIcon className="w-5 h-5 font-bold"/>
                                    Subscribe
                                </Link>
                            }
                        </nav>
                    </section>
                    <HeaderResponsive membership={token.membership} /> 
                </main>
            }
        </header>
    )
}