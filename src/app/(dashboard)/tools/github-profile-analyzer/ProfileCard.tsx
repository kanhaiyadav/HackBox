import { ProfileAnalysis } from "@/types";
import Image from "next/image";

export default function ProfileCard({ profile }: { profile: ProfileAnalysis }) {
    const { user, starCount, forkCount } = profile;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <div className="flex items-center space-x-6">
                    <Image
                        src={user.avatar_url}
                        alt={`${user.login}'s avatar`}
                        className="rounded-full border-2 border-blue-500"
                        width={96}
                        height={96}
                    />
                    <div>
                        <h2 className="text-2xl font-bold">
                            {user.name || user.login}
                            {user.name && (
                                <span className="text-gray-600 text-lg ml-2">
                                    ({user.login})
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-700 mt-1">{user.bio}</p>
                        <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-gray-500 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{user.followers} followers</span>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-gray-500 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{user.following} following</span>
                            </div>
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-gray-500 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{user.public_repos} repositories</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Stars"
                        value={starCount}
                        icon={
                            <svg
                                className="w-6 h-6 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Forks"
                        value={forkCount}
                        icon={
                            <svg
                                className="w-6 h-6 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Contributions"
                        value={profile.contributions.total_contributions}
                        icon={
                            <svg
                                className="w-6 h-6 text-blue-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Account Age"
                        value={Math.floor(
                            (new Date().getTime() -
                                new Date(user.created_at).getTime()) /
                                (1000 * 60 * 60 * 24 * 365)
                        )}
                        unit="years"
                        icon={
                            <svg
                                className="w-6 h-6 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                </div>

                {user.location || user.company || user.blog ? (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3">Details</h3>
                        <div className="flex flex-wrap gap-4">
                            {user.location && (
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-gray-500 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.company && (
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-gray-500 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        />
                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                    </svg>
                                    <span>{user.company}</span>
                                </div>
                            )}
                            {user.blog && (
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-gray-500 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <a
                                        href={
                                            user.blog.startsWith("http")
                                                ? user.blog
                                                : `https://${user.blog}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {user.blog.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                    View on GitHub
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
}

const StatCard = ({
    title,
    value,
    icon,
    unit = "",
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    unit?: string;
}) => (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold">
                {value?.toLocaleString()}
                {unit && ` ${unit}`}
            </p>
        </div>
    </div>
);
