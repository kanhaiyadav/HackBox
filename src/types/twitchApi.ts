const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
const TWITCH_AUTH_TOKEN = process.env.NEXT_PUBLIC_TWITCH_AUTH_TOKEN;

const headers = {
    "Client-ID": TWITCH_CLIENT_ID || "",
    Authorization: `Bearer ${TWITCH_AUTH_TOKEN}` || "",
};

export async function fetchTwitchUser(username: string) {
    try {
        const response = await fetch(
            `https://api.twitch.tv/helix/users?login=${username}`,
            { headers }
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0];
        }
        return null;
    } catch (error) {
        console.error("Error fetching Twitch user:", error);
        throw error;
    }
}

export async function fetchTwitchStream(userId: string) {
    try {
        const response = await fetch(
            `https://api.twitch.tv/helix/streams?user_id=${userId}`,
            { headers }
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            return {
                isLive: true,
                ...data.data[0],
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching Twitch stream:", error);
        throw error;
    }
}

// utils/formatters.ts
export function formatDuration(startDate: Date): string {
    const diff = Math.floor(
        (new Date().getTime() - startDate.getTime()) / 1000
    );

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}
