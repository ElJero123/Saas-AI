export async function fetchRegisterUser(name: string, email: string, password: string) {
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })

    // la data es un mensaje de exito o error
    const data = await res.json()

    return data
}

export async function fetchLoginUser(email: string, password: string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    return res
}

export async function sendMessage(message: string, name: string, userId: string, email: string, chatId: string) {
    if (!message) return { error: 'No message' }
    if (message.length < 2) return { error: 'Message too short' }

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, name, userId, email, chatId })
    })

    // lista de mensajes
    // dividos por chats
    // cada chat tiene un id

    const data = await res.json()

    return data
}

export async function fetchChats(userId: string) {
    const res = await fetch('/api/get-chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const data = await res.json()

    return data
}

export async function fetchMessages(chatId: string, userId: string) {
    const res = await fetch('/api/get-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId, userId })
    })

    const data = await res.json()

    return data
}

export async function fetchAddChat(userId: string) {
    const res = await fetch('/api/add-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const data = await res.json()

    return data
}

export async function fetchDeleteChat(userId: string) {
    const res = await fetch('/api/add-chat', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const data = await res.json()

    return data
}

export async function fetchDeleteCookie() {
    const res = await fetch('/api/delete-cookie', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await res.json()

    return data
}

export async function fetchCheckout(userId: string, cancelAtPeriodEnd: boolean) {
    const res = await fetch('/api/create-checkout-sesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, cancelAtPeriodEnd })
    })

    const data = await res.json()

    return data
}

export async function fetchCancelSub (userId: string) {
    const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const message = await res.json()

    return message
}

export async function fetchRenewSub(userId: string) {
    const res = await fetch('/api/renew-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const message = await res.json()

    return message
}

export async function fetchSub(userId: string) {
    const res = await fetch('/api/get-sub', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const sub = await res.json()

    return sub
}

export async function fetchAudio (text: string, userId: string) {
    const res = await fetch('/api/get-audio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, userId: userId })
    })

    const audio = await res.json()

    return audio
}

export async function fetchAudios(userId: string) {
    const res = await fetch('/api/get-audios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const audios = await res.json()

    return audios
}

export async function fetchDeleteAudio(audioId: string) {
    const res = await fetch('/api/delete-audio', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioId })
    })

    const data = await res.json()

    return data
}

export async function fetchDeleteAccount(userId: string) {
    const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })

    const data = await res.json()

    return data
}
