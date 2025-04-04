// File: types/api.ts
export type ApiStatus = "up" | "down" | "degraded";

export interface StatusHistoryEntry {
    timestamp: string;
    status: ApiStatus;
    responseTime: number;
}

export interface ApiEndpoint {
    id: string;
    name: string;
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";
    headers?: Record<string, string>;
    body?: string;
    status?: ApiStatus;
    responseTime?: number;
    lastChecked?: string;
    failureThreshold?: number;
    successThreshold?: number;
    timeout?: number;
    group?: string;
    tags?: string[];
    notifications?: boolean;
    history?: StatusHistoryEntry[];
}
