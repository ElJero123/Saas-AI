"use client"

import { fetchDeleteAccount } from "@/lib/fetchs";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BtnDeleteAccount({ userId }: { userId: string }) {
    const router = useRouter()

    const handleDeleteAccount = async () => {
        const res = await fetchDeleteAccount(userId)
        if (res.status === 200) {
            toast.success("Account deleted successfully")
            location.reload()
            router.push("/")
        }
        
        if (res.error) {
            toast.error(res.error)
        }
    }
    return (
        <Popover className="relative">
            <PopoverButton className="hover:outline-1 hover:text-red-500 hover:bg-transparent hover:outline-red-500 p-2 bg-red-500 rounded-md btn-outline w-full">
                Delete Account
            </PopoverButton>
            <PopoverPanel className="absolute z-10 w-80 p-4 mt-2 bg-black/95 border border-gray-200 rounded shadow-lg">
                <div className="text-center">
                    <p className="mb-4">Are you sure you want to delete your account?</p>
                    <p className="mb-4 text-red-500">This action cannot be undone.</p>
                    <p className="mb-4 text-red-500 font-bold">You´ll lose all chats, audios and active subscriptions</p>
                    <button
                        className="hover:outline-1 hover:text-red-500 hover:bg-transparent hover:outline-red-500 p-2 bg-red-500 rounded-md btn-outline w-full"
                        onClick={handleDeleteAccount}
                    >
                        Confirm Delete
                    </button>
                </div>
            </PopoverPanel>
        </Popover>
    )
}