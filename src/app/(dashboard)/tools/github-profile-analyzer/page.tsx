'use client'

import { useState } from "react";
import { analyzeProfile, compareProfiles } from "@/services/github.service";
import { ProfileAnalysis, ComparisonResult } from "@/types";
import ProfileCard from "./ProfileCard";
import ComparisonView from "./ComparisonView";
import LanguageChart from "./LanguageChart";
import ActivityHeatmap from "./ActivityHeatmap";
import RepoStats from "./RepoStats";

export default function GitHubAnalyzer() {
    const [username, setUsername] = useState("");
    const [username1, setUsername1] = useState("");
    const [username2, setUsername2] = useState("");
    const [profile, setProfile] = useState<ProfileAnalysis | null>(null);
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!username) return;

        setLoading(true);
        setError("");
        try {
            const result = await analyzeProfile(username);
            setProfile(result);
            setComparison(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to analyze profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = async () => {
        if (!username1 || !username2) return;

        setLoading(true);
        setError("");
        try {
            const result = await compareProfiles(username1, username2);
            setComparison(result);
            setProfile(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to compare profiles"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    GitHub Profile Analyzer
                </h1>

                {/* Analysis Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Analyze Single Profile
                    </h2>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter GitHub username"
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Analyze"}
                        </button>
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Compare Two Profiles
                    </h2>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={username1}
                            onChange={(e) => setUsername1(e.target.value)}
                            placeholder="First GitHub username"
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={username2}
                            onChange={(e) => setUsername2(e.target.value)}
                            placeholder="Second GitHub username"
                            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCompare}
                            disabled={loading}
                            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? "Comparing..." : "Compare"}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {/* Results */}
                {profile && (
                    <div className="space-y-8">
                        <ProfileCard profile={profile} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Language Distribution
                                </h3>
                                <LanguageChart languages={profile.languages} />
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Activity Heatmap
                                </h3>
                                <ActivityHeatmap
                                    contributions={profile.contributions}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Repository Statistics
                            </h3>
                            <RepoStats profile={profile} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                title="Impact Score"
                                value={profile.impactScore}
                                max={100}
                                description="Overall influence and reach"
                            />
                            <MetricCard
                                title="Activity Score"
                                value={profile.activityScore}
                                max={100}
                                description="Recent development activity"
                            />
                            <MetricCard
                                title="Trend Score"
                                value={profile.trendScore}
                                max={100}
                                description="Momentum in activity"
                            />
                        </div>
                    </div>
                )}

                {comparison && <ComparisonView comparison={comparison} />}
            </div>
        </div>
    );
}

const MetricCard = ({
    title,
    value,
    max,
    description,
}: {
    title: string;
    value: number;
    max: number;
    description: string;
}) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${(value / max) * 100}%` }}
                ></div>
            </div>
            <span className="ml-2 font-medium">{value}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);
