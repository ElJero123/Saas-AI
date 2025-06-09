import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function DELETE() {
    const cookieStore = await cookies()
    
    try {
        cookieStore.delete("refresh_token")
        return NextResponse.json({ message: "Cookie deleted", status: 200 }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ message: `Error deleting cookie, ${e}` }, { status: 500 })
    }   
}