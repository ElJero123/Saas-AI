"use client"

import { fetchDeleteCookie } from "@/lib/fetchs"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { toast } from "sonner"

export default function BtnLogout() {

    const deleteCookie = async () => {
        const res = await fetchDeleteCookie() 
        console.log(res)

        if (res.status === 200) {
            toast.success('Logout successful')
            location.reload()
            location.href = '/'
        } else {
            toast.success('Error deleting cookie')
        }
    }

    return (
        <Popover>
           <PopoverButton className="w-full bg-red-500 text-white p-2 rounded-md hover:outline-1 hover:outline-red-500 hover:bg-transparent hover:text-red-500 duration-200">
                    Logout
            </PopoverButton>
            <PopoverPanel className="absolute z-10 w-80 p-4 mt-2 bg-black/95 border border-gray-200 rounded shadow-lg">
                <div className="text-center">
                    <p className="mb-4">Are you sure you want to logout?</p>
                    <button
                        className="hover:outline-1 hover:text-red-500 hover:bg-transparent hover:outline-red-500 p-2 bg-red-500 rounded-md btn-outline w-full"
                        onClick={deleteCookie}
                    >
                        Confirm Logout
                    </button>
                </div>
            </PopoverPanel> 
        </Popover>
        
    )
}