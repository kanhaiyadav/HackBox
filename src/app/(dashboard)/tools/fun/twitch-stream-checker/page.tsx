"use client";

import { useState, useEffect } from "react";
import {
    FiSearch,
    FiRefreshCw,
    FiHeart,
    // FiEye,
    // FiClock,
    // FiUser,
    FiTwitch,
} from "react-icons/fi";
import Layout from "./Layout";
import StreamCard from "./StreamCard";
import FavoritesList from "./FavouriteList";
import { Stream } from "@/types/stream";
import { fetchTwitchStream, fetchTwitchUser } from "@/types/twitchApi";

export default function Home() {
    const [username, setUsername] = useState<string>("");
    const [currentStream, setCurrentStream] = useState<Stream | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from localStorage on component mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem("twitchFavorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Save favorites to localStorage when they change
    useEffect(() => {
        localStorage.setItem("twitchFavorites", JSON.stringify(favorites));
    }, [favorites]);

    const checkStream = async (streamerName: string) => {
        setLoading(true);
        setError("");
        try {
            const userData = await fetchTwitchUser(streamerName);

            if (!userData) {
                setError("User not found");
                setCurrentStream(null);
                setLoading(false);
                return;
            }

            const streamData = await fetchTwitchStream(userData.id);

            if (streamData) {
                setCurrentStream({
                    ...streamData,
                    profileImageUrl: userData.profile_image_url,
                    username: userData.display_name,
                    userId: userData.id,
                });
            } else {
                setCurrentStream({
                    isLive: false,
                    username: userData.display_name,
                    profileImageUrl: userData.profile_image_url,
                    userId: userData.id,
                });
            }
        } catch (err) {
            setError("Error checking stream status. Please try again.");
            console.error(err);
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            checkStream(username.trim());
        }
    };

    const toggleFavorite = (username: string) => {
        if (favorites.includes(username)) {
            setFavorites(favorites.filter((name) => name !== username));
        } else {
            setFavorites([...favorites, username]);
        }
    };

    const isFavorite = (username: string) => favorites.includes(username);

    return (
        <Layout>
            <div className="flex flex-col items-center">
                <div className="flex items-center mb-6 text-purple-500">
                    <FiTwitch className="text-4xl mr-2" />
                    <h1 className="text-3xl font-bold">
                        Twitch Stream Checker
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-lg mb-8">
                    <div className="flex items-center border-2 border-purple-600 rounded-lg overflow-hidden bg-gray-800">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Twitch username"
                            className="w-full px-4 py-3 bg-gray-800 text-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 px-4 py-3 text-white hover:bg-purple-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <FiRefreshCw className="animate-spin" />
                            ) : (
                                <FiSearch />
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="w-full max-w-lg mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {currentStream && (
                    <div className="w-full max-w-lg mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                Stream Status
                            </h2>
                            <button
                                onClick={() =>
                                    currentStream.username &&
                                    toggleFavorite(currentStream.username)
                                }
                                className={`p-2 rounded-full ${
                                    isFavorite(currentStream.username || "")
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-700 text-gray-300"
                                } hover:bg-purple-500 transition-colors`}
                                aria-label={`${
                                    isFavorite(currentStream.username || "")
                                        ? "Remove from"
                                        : "Add to"
                                } favorites`}
                            >
                                <FiHeart />
                            </button>
                        </div>
                        <StreamCard
                            stream={currentStream}
                            onRefresh={() =>
                                currentStream.username &&
                                checkStream(currentStream.username)
                            }
                        />
                    </div>
                )}

                {favorites.length > 0 && (
                    <div className="w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            Your Favorites
                        </h2>
                        <FavoritesList
                            favorites={favorites}
                            onCheck={checkStream}
                            onRemove={toggleFavorite}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}
