"use client"

import 'plyr-react/plyr.css'
import { fetchAudio } from "@/lib/fetchs"
import dynamic from "next/dynamic"
import { FormEvent, useEffect, useState } from "react"
import { toast } from 'sonner'

export default function Audio({ userId }: { userId: string }) {
    const [textAudio, setTextAudio] = useState('')
    const [source, setSource] = useState<Plyr.SourceInfo | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const Plyr = dynamic(() => import('plyr-react'), { ssr: false })

    useEffect(() => {
        return () => {
            if (source?.sources?.[0]?.src?.startsWith('blob:')) {
                URL.revokeObjectURL(source.sources[0].src)
            }
        }
    }, [source])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!textAudio) return

        setIsLoading(true)
        const obj = await fetchAudio(textAudio, userId)

        if (obj.status === 200) {
            const unit8Array = new Uint8Array(obj.audio.data)
            const blob = new Blob([unit8Array], { type: 'audio/mpeg' })
            const audioUrl = URL.createObjectURL(blob)

            toast.success('Audio generated successfully')

            setSource({
                type: 'audio',
                sources: [{
                    src: audioUrl,
                    type: 'audio/mpeg'
                }]
            })

            setIsLoading(false)
            setTextAudio('')
        } else {
            toast.error(obj.error)
            setIsLoading(false)
            setTextAudio('')
            setSource(undefined)
            return
        }
    }

    return (
        <main className="flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center mt-5 gap-5">
                <input type="text" 
                value={textAudio}
                placeholder="Start typing or paste any text you to turn into lifelike speech"
                className="bg-neutral-100 w-21/22 rounded-md p-2 text-black"
                onChange={(e) => setTextAudio(e.target.value)}/>
                <button className="bg-neutral-100 px-4 py-2 rounded-md text-black">Send audio</button>
            </form>
            
            <div className='w-full h-[200px] p-2 flex justify-center items-center'>
                {isLoading && <p className="text-white text-2xl font-bold">Loading audio...</p>}
                {!isLoading && source && !textAudio && <div className='w-3/4'><Plyr key={source.sources[0].src} source={source} options={{ controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume'] }}/></div>} 
            </div>
        </main>
    )
}