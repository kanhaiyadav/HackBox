'use client';

import { useState, useRef, useEffect } from "react";
import {
    FaPlay,
    FaStop,
    FaVolumeUp,
    FaVolumeMute,
    FaRandom,
    FaHeart,
    FaDownload,
    FaShareAlt,
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

// Define sound types
interface Sound {
    id: string;
    name: string;
    file: string;
    color: string;
    icon?: JSX.Element;
}

const Soundboard = () => {
    // State for active sound and volume
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState<number>(0.7);
    const [muted, setMuted] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    // Collection of sounds
    const sounds: Sound[] = [
        {
            id: "bruh",
            name: "Bruh",
            file: "/sounds/bruh.mp3",
            color: "bg-red-500",
        },
        {
            id: "windows-error",
            name: "Windows Error",
            file: "/sounds/windows-error.mp3",
            color: "bg-blue-500",
        },
        {
            id: "airhorn",
            name: "Airhorn",
            file: "/sounds/airhorn.mp3",
            color: "bg-yellow-500",
        },
        {
            id: "sad-trombone",
            name: "Sad Trombone",
            file: "/sounds/sad-trombone.mp3",
            color: "bg-purple-500",
        },
        {
            id: "wow",
            name: "Wow",
            file: "/sounds/wow.mp3",
            color: "bg-pink-500",
        },
        {
            id: "applause",
            name: "Applause",
            file: "/sounds/applause.mp3",
            color: "bg-indigo-500",
        },
        {
            id: "fart",
            name: "Fart",
            file: "/sounds/fart.mp3",
            color: "bg-orange-500",
        },
        {
            id: "suspense",
            name: "Suspense",
            file: "/sounds/suspense.mp3",
            color: "bg-cyan-500",
        },
        {
            id: "tada",
            name: "Ta-Da",
            file: "/sounds/tada.mp3",
            color: "bg-lime-500",
        },
        
        {
            id: "golmal",
            name: "Golmal",
            file: "/sounds/golmal.mp3",
            color: "bg-lime-500",
        },
        {
            id: "hey-prabhu",
            name: "Hey Prabhu",
            file: "/sounds/hey-prabhu.mp3",
            color: "bg-green-500",
        },
        {
            id: "moye-moye",
            name: "Moye Moye",
            file: "/sounds/moye-moye.mp3",
            color: "bg-lime-700",
        },
        {
            id: "vine-boom",
            name: "Vine Boom",
            file: "/sounds/vine-boom.mp3",
            color: "bg-lime-700",
        },
        {
            id: "paisa-hi-paisa",
            name: "Paisa Hi Paisa",
            file: "/sounds/paisa-hi-paisa.mp3",
            color: "bg-yellow-700",
        },
        {
            id: "so-beautiful",
            name: "So Beautiful",
            file: "/sounds/so-beautiful.mp3",
            color: "bg-green-500",
        },
        {
            id: "yeah-boy",
            name: "Yeah boy",
            file: "/sounds/yeah-boy.mp3",
            color: "bg-blue-500",
        },
        {
            id: "yes-daddy",
            name: "Yes Daddy",
            file: "/sounds/yes-daddy.mp3",
            color: "bg-pink-500",
        },
        
    ];

    // Generate simulated waveform data
    const generateWaveformData = () => {
        const numberOfBars = 12;
        const newData = Array.from(
            { length: numberOfBars },
            () => Math.random() * 0.8 + 0.2 // Values between 0.2 and 1
        );
        setWaveformData(newData);
    };

    // Animation loop for waveform
    const updateWaveform = () => {
        if (activeSound) {
            generateWaveformData();
            animationRef.current = requestAnimationFrame(updateWaveform);
        }
    };

    // Play sound function
    const playSound = (sound: Sound) => {
        if (audioRef.current) {
            // Stop current sound if playing
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            // Set new sound
            audioRef.current.src = sound.file;
            audioRef.current.volume = muted ? 0 : volume;

            // Play the sound
            audioRef.current
                .play()
                .then(() => {
                    setActiveSound(sound.id);

                    // Start waveform animation
                    if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current);
                    }
                    animationRef.current =
                        requestAnimationFrame(updateWaveform);
                })
                .catch((err) => {
                    console.error("Error playing sound:", err);
                    setActiveSound(null);
                });

            // When sound ends, reset active sound
            audioRef.current.onended = () => {
                setActiveSound(null);
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    };

    // Stop sound function
    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setActiveSound(null);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }
    };

    // Play random sound
    const playRandomSound = () => {
        const randomIndex = Math.floor(Math.random() * sounds.length);
        playSound(sounds[randomIndex]);
    };

    // Toggle favorite
    const toggleFavorite = (soundId: string) => {
        if (favorites.includes(soundId)) {
            setFavorites(favorites.filter((id) => id !== soundId));
        } else {
            setFavorites([...favorites, soundId]);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? volume : 0;
        }
        setMuted(!muted);
    };

    // Clean up animation on component unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Initialize waveform data
    useEffect(() => {
        generateWaveformData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <audio ref={audioRef} />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                    Ultimate Soundboard
                </h1>

                {/* Control Panel */}
                <div className="bg-gray-800 p-4 rounded-lg mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={stopSound}
                            className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all duration-200"
                            disabled={!activeSound}
                        >
                            <FaStop />
                        </button>

                        <button
                            onClick={playRandomSound}
                            className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full transition-all duration-200"
                        >
                            <FaRandom />
                        </button>

                        <button
                            onClick={toggleMute}
                            className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-all duration-200"
                        >
                            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs">
                            {Math.round(volume * 100)}%
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => {
                                const newVolume = parseFloat(e.target.value);
                                setVolume(newVolume);
                                if (audioRef.current && !muted) {
                                    audioRef.current.volume = newVolume;
                                }
                            }}
                            className="w-32 accent-purple-500"
                        />
                    </div>

                    <div className="text-sm">
                        {activeSound ? (
                            <span className="bg-gray-700 px-3 py-1 rounded-full">
                                Now Playing:{" "}
                                {sounds.find((s) => s.id === activeSound)?.name}
                            </span>
                        ) : (
                            <span className="text-gray-400">Ready to play</span>
                        )}
                    </div>
                </div>

                {/* Sound Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {sounds.map((sound) => (
                        <button
                            key={sound.id}
                            onClick={() => playSound(sound)}
                            className={`
                ${sound.color} h-24 rounded-lg
                flex flex-col items-center justify-center
                hover:scale-105 transition-all duration-200
                relative overflow-hidden
                ${activeSound === sound.id ? "ring-4 ring-white" : ""}
              `}
                        >
                            <span className="text-xl font-bold">
                                {sound.name}
                            </span>

                            <div className="absolute top-2 right-2 flex gap-1">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(sound.id);
                                    }}
                                    className={`text-xs p-1 rounded-full ${
                                        favorites.includes(sound.id)
                                            ? "text-red-500"
                                            : "text-white opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <FaHeart />
                                </div>
                            </div>

                            {activeSound === sound.id && (
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    {/* Audio Waveform Visualization */}
                                    <div className="flex items-end justify-center gap-1 h-12 w-3/4">
                                        {waveformData.map((value, index) => (
                                            <div
                                                key={index}
                                                className={`w-1 bg-white rounded-sm opacity-80 transition-all duration-75`}
                                                style={{
                                                    height: `${value * 100}%`,
                                                    animation:
                                                        "pulse 0.5s infinite alternate",
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Favorites Section */}
                {favorites.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Favorites</h2>
                        <div className="flex flex-wrap gap-2">
                            {favorites.map((favId) => {
                                const favSound = sounds.find(
                                    (s) => s.id === favId
                                );
                                if (!favSound) return null;

                                return (
                                    <button
                                        key={`fav-${favId}`}
                                        onClick={() => playSound(favSound)}
                                        className={`
                      ${favSound.color} px-3 py-2 rounded-md
                      flex items-center gap-2
                      hover:scale-105 transition-all duration-200
                      ${activeSound === favSound.id ? "ring-2 ring-white" : ""}
                      relative overflow-hidden
                    `}
                                    >
                                        <FaPlay className="text-xs" />
                                        <span>{favSound.name}</span>

                                        {activeSound === favSound.id && (
                                            <div className="absolute right-2 top-0 bottom-0 flex items-center">
                                                <div className="flex items-end h-6 gap-px">
                                                    {waveformData
                                                        .slice(0, 5)
                                                        .map((value, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-px bg-white"
                                                                style={{
                                                                    height: `${
                                                                        value *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Global Visualizer (when any sound is playing) */}
                {activeSound && (
                    <div className="mt-8 bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-lg font-medium mb-4">
                            Now Playing:{" "}
                            {sounds.find((s) => s.id === activeSound)?.name}
                        </h2>
                        <div className="h-16 flex items-end justify-center gap-2">
                            {waveformData.map((value, index) => (
                                <div
                                    key={`global-${index}`}
                                    className={`w-4 rounded-t-md transition-all duration-75 ${
                                        sounds.find((s) => s.id === activeSound)
                                            ?.color
                                    }`}
                                    style={{ height: `${value * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center text-gray-400 text-sm">
                    <p>
                        Note: Sound files should be placed in the public/sounds
                        directory
                    </p>
                    <p className="mt-2">
                        <button
                            className="text-purple-400 hover:text-purple-300"
                            onClick={() =>
                                alert("Sorry, no downloads available yet!")
                            }
                        >
                            <FaDownload className="inline mr-1" /> Download All
                            Sounds
                        </button>
                    </p>
                </div>
            </div>

            {/* Add some global styles for animations */}
            <style jsx global>{`
                @keyframes pulse {
                    0% {
                        transform: scaleY(0.6);
                    }
                    100% {
                        transform: scaleY(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default Soundboard;
