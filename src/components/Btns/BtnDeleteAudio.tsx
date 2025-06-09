"use client"

import { fetchDeleteAudio } from "@/lib/fetchs"
import { TrashIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"

export default function BtnDeleteAudio({ audioId, isResponsive }: { audioId: string, isResponsive?: boolean }) {
    const handleDeleteAudio = async () => {
        const res = await fetchDeleteAudio(audioId)
        
        if (res.status === 200) {
            toast.success('Audio deleted successfully')
            location.reload()
        } else {
            toast.error(`Error deleting audio: ${res.message}`)
        }
    }
    
    return (
        <button onClick={() => handleDeleteAudio()} className={`${isResponsive && "hidden md:flex"} p-2 rounded-md hover:outline-1 hover:outline-red-500 ease-in-out`}><TrashIcon className="w-5 h-5 text-red-500"/></button>
    )
}