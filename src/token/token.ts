import { cookies } from "next/headers"
import { REFRESH_KEY } from "../../config/config"
import { JwtTokenDecoded } from "@/types/types"
import { jwtVerify } from "jose"

export async function getToken() {
    const cookieStore = await cookies()
    const refreshKey = new TextEncoder().encode(REFRESH_KEY ?? '')
    const token = cookieStore.get('refresh_token')?.value
    
    try {
        const { payload }: { payload: JwtTokenDecoded } = await jwtVerify(token ?? '', refreshKey)
        return payload
    } catch {}
}

