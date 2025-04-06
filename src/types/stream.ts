export interface Stream {
    isLive: boolean;
    username?: string;
    profileImageUrl?: string;
    userId?: string;

    // Properties for when stream is live
    id?: string;
    game_id?: string;
    game_name?: string;
    title?: string;
    viewer_count?: number;
    started_at?: string;
    language?: string;
    thumbnail_url?: string;
    tags?: string[];
}
