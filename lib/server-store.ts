import fs from 'fs'
import path from 'path'

// We store the data locally in a JSON file
const DB_FILE = path.join(process.cwd(), '.sent_notifications.json')

export type SentNotification = {
    userId: number
    vaccineName: string
    type: string
    sentAt: string // ISO date string
}

/**
 * Initializes the JSON store if it doesn't exist
 */
function initStore(): SentNotification[] {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8')
            return JSON.parse(data)
        }
    } catch (error) {
        console.error('Failed to read sent notifications DB, resetting:', error)
    }
    return []
}

/**
 * Saves the current store to disk
 */
function saveStore(store: SentNotification[]) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2))
    } catch (error) {
        console.error('Failed to write to sent notifications DB:', error)
    }
}

/**
 * Checks if a specific notification has already been sent to the target user.
 * It assumes a notification is duplicate if sent within the same day.
 */
export function hasNotificationBeenSent(userId: number, vaccineName: string, type: string): boolean {
    const store = initStore()
    const todayPrefix = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

    return store.some((n) => {
        return (
            n.userId === userId &&
            n.vaccineName === vaccineName &&
            n.type === type &&
            n.sentAt.startsWith(todayPrefix)
        )
    })
}

/**
 * Records that a notification has been sent.
 */
export function markNotificationSent(userId: number, vaccineName: string, type: string) {
    const store = initStore()

    store.push({
        userId,
        vaccineName,
        type,
        sentAt: new Date().toISOString(),
    })

    // To prevent the file from growing infinitely, we can just retain the last 500 records
    if (store.length > 500) {
        store.splice(0, store.length - 500)
    }

    saveStore(store)
}
