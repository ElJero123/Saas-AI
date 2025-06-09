"use client"

import 'plyr-react/plyr.css'
import { fetchAudios } from "@/lib/fetchs"
import { ObjAudio } from "@/types/types"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import BtnDeleteAudio from '../Btns/BtnDeleteAudio'
import Link from 'next/link'
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { toast } from 'sonner'

export default function ListAudios({ userId, isSavedAudios }: { userId: string, isSavedAudios?: boolean }) {
    const [objAudios, setObjAudios] = useState<ObjAudio[] | undefined >([])
    const [isLoading, setIsLoading] = useState(false)
    const [changer, setChanger] = useState(false)
    const Plyr = dynamic(() => import('plyr-react'), { ssr: false })

    useEffect(() => {
        const getAudios = async () => {
            setIsLoading(true)
            const audios = await fetchAudios(userId)

            if (audios.status === 200) {
                const audiosUrl = audios.audios.map((audio: ObjAudio) => {
                    const byteArray = new Uint8Array(audio.audio.data)
                    const blob = new Blob([byteArray], { type: 'audio/mpeg' })
                    const url = URL.createObjectURL(blob)

                    return {
                        ...audio,
                        url
                    }
                })
                
                setObjAudios(audiosUrl)
                setIsLoading(false)
            } else {
                toast.error('Error fetching audios')
                setIsLoading(false)
            }
        }

        getAudios()
    }, [userId, changer])

    return (
        <main className={`${!isSavedAudios ? 'w-full m-0 p-2 rounded-md bg-black/85' : 'w-3/4 p-2'}`}>
            <section>
                {!isSavedAudios && <div className='flex w-full justify-end items-center p-2'>
                    <button onClick={() => {
                        setObjAudios([])
                        setChanger(!changer)
                    }} className='p-2 rounded-md hover:outline-1 hover:outline-white ease-in-out'>
                        <ArrowPathIcon className='w-3 h-3'/>
                    </button>
                </div>}
                <h1 className="text-center text-2xl font-bold">Fecha de los Audios UTC-0</h1>
                {objAudios?.length === 0 && !isLoading && <h1 className='m-2 text-1xl font-bold text-center'>Audios not found</h1>}
                {isLoading && <p className="m-2 text-white text-center">Loading audios...</p>}
                <ul className={`p-2 xl:grid xl:grid-cols-[1fr_1fr] w-full gap-2 overflow-y-auto ${!isSavedAudios ? "md:max-h-[400px] max-h-[200px]" : "max-h-[700px]"} scrollbar-custom`}>
                    {objAudios?.map((audio) => {
                        const createAtAudio = new Date(audio.created_at).toLocaleString()
                        const audioSource: Plyr.SourceInfo = {
                            type: 'audio',
                            sources: [{
                                src: audio.url!,
                                type: 'audio/mpeg'
                            }]
                        }

                        return (
                              audio.url && (
                                <li key={audio.audio_id} className={`w-full ${!isSavedAudios && "bg-black/98"} sm:p-4 py-4 px-1 rounded-md mt-1`}>
                                    <h1 className="font-bold">{createAtAudio}</h1>
                                    <div className="flex flex-col sm:flex-row mt-1 justify-between items-center sm:gap-3 gap-2">
                                        <Plyr source={audioSource} options={{ controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume'] }}/>
                                        <div className='md:hidden flex gap-3 items-center mt-1'>
                                            <BtnDeleteAudio audioId={audio.audio_id} />
                                            <Link href={audio.url} className='p-2 rounded-md hover:outline-1 ease-in-out' download={`${createAtAudio}.mpeg`}><ArrowDownTrayIcon className='w-5 h-5'/></Link>
                                        </div>
                                        <BtnDeleteAudio audioId={audio.audio_id} isResponsive={true} />
                                        <Link href={audio.url} className='hidden md:flex p-2 rounded-md hover:outline-1 ease-in-out' download={`${createAtAudio}.mpeg`}><ArrowDownTrayIcon className='w-5 h-5'/></Link>
                                    </div>
                                </li>
                            )     
                        )   
                    })}  
                </ul>
            </section>
        </main>
    )
}