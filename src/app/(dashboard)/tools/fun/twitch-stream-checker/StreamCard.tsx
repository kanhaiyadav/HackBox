'use client';

import { useState } from "react";
import Image from "next/image";
import { FiEye, FiClock, FiTag, FiRefreshCw, FiUser } from "react-icons/fi";
import { Stream } from "@/types/stream";
import { formatDuration } from "@/types/twitchApi";

interface StreamCardProps {
    stream: Stream;
    onRefresh: () => void;
}

const StreamCard = ({ stream, onRefresh }: StreamCardProps) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-700">
                    {stream.profileImageUrl ? (
                        <Image
                            src={stream.profileImageUrl}
                            alt={stream.username || "Streamer"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <FiUser className="text-2xl text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{stream.username}</h3>
                    <div className="flex items-center mt-1">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                stream.isLive
                                    ? "bg-red-900/50 text-red-200"
                                    : "bg-gray-700 text-gray-300"
                            }`}
                        >
                            {stream.isLive ? "LIVE" : "OFFLINE"}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    aria-label="Refresh stream status"
                >
                    <FiRefreshCw
                        className={isRefreshing ? "animate-spin" : ""}
                    />
                </button>
            </div>

            {stream.isLive && stream.title && (
                <div className="p-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-2">{stream.title}</h4>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                        {stream.game_name && (
                            <div className="flex items-center">
                                <FiTag className="mr-1" />
                                <span>{stream.game_name}</span>
                            </div>
                        )}

                        {stream.viewer_count && (
                            <div className="flex items-center">
                                <FiEye className="mr-1" />
                                <span>
                                    {stream.viewer_count.toLocaleString()}{" "}
                                    viewers
                                </span>
                            </div>
                        )}

                        {stream.started_at && (
                            <div className="flex items-center">
                                <FiClock className="mr-1" />
                                <span>
                                    {formatDuration(
                                        new Date(stream.started_at)
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {stream.isLive && stream.thumbnail_url && (
                <div className="relative aspect-video w-full">
                    <Image
                        src={stream.thumbnail_url
                            .replace("{width}", "640")
                            .replace("{height}", "360")}
                        alt="Stream thumbnail"
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default StreamCard;