import { ComparisonResult } from "@/types";
import ProfileCard from "./ProfileCard";
import LanguageChart from "./LanguageChart";

export default function ComparisonView({
    comparison,
}: {
    comparison: ComparisonResult;
}) {
    const {
        user1,
        user2,
        differences,
        commonLanguages,
        uniqueLanguages,
        relativeStrengths,
    } = comparison;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">
                Profile Comparison
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileCard profile={user1} />
                <ProfileCard profile={user2} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Key Differences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ComparisonMetric
                        title="Stars"
                        value1={user1.starCount}
                        value2={user2.starCount}
                        difference={differences.stars}
                    />
                    <ComparisonMetric
                        title="Forks"
                        value1={user1.forkCount}
                        value2={user2.forkCount}
                        difference={differences.forks}
                    />
                    <ComparisonMetric
                        title="Contributions"
                        value1={user1.contributions.total_contributions}
                        value2={user2.contributions.total_contributions}
                        difference={differences.contributions}
                    />
                    <ComparisonMetric
                        title="Followers"
                        value1={user1.user.followers}
                        value2={user2.user.followers}
                        difference={differences.followers}
                    />
                    <ComparisonMetric
                        title="Public Repos"
                        value1={user1.user.public_repos}
                        value2={user2.user.public_repos}
                        difference={differences.publicRepos}
                    />
                    <ComparisonMetric
                        title="Impact Score"
                        value1={user1.impactScore}
                        value2={user2.impactScore}
                        difference={differences.impactScore}
                        isPercentage
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Language Comparison
                    </h3>
                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Common Languages</h4>
                        {commonLanguages.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {commonLanguages.map((lang) => (
                                    <span
                                        key={lang}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No common languages</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">
                                {user1.user.login}'s Unique Languages
                            </h4>
                            {uniqueLanguages.user1.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {uniqueLanguages.user1.map((lang) => (
                                        <span
                                            key={lang}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No unique languages
                                </p>
                            )}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">
                                {user2.user.login}'s Unique Languages
                            </h4>
                            {uniqueLanguages.user2.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {uniqueLanguages.user2.map((lang) => (
                                        <span
                                            key={lang}
                                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No unique languages
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Relative Strengths
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2">
                                {user1.user.login} is stronger in:
                            </h4>
                            {relativeStrengths.user1.length > 0 ? (
                                <ul className="space-y-2">
                                    {relativeStrengths.user1.map((strength) => (
                                        <li
                                            key={strength}
                                            className="flex items-start"
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No significant strengths
                                </p>
                            )}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">
                                {user2.user.login} is stronger in:
                            </h4>
                            {relativeStrengths.user2.length > 0 ? (
                                <ul className="space-y-2">
                                    {relativeStrengths.user2.map((strength) => (
                                        <li
                                            key={strength}
                                            className="flex items-start"
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No significant strengths
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {user1.user.login}'s Languages
                    </h3>
                    <LanguageChart languages={user1.languages} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {user2.user.login}'s Languages
                    </h3>
                    <LanguageChart languages={user2.languages} />
                </div>
            </div>
        </div>
    );
}

const ComparisonMetric = ({
    title,
    value1,
    value2,
    difference,
    isPercentage = false,
}: {
    title: string;
    value1: number;
    value2: number;
    difference: number;
    isPercentage?: boolean;
}) => {
    const isPositive = difference > 0;
    const absDifference = Math.abs(difference);

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">{title}</h4>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm">User 1</span>
                <span className="font-semibold">
                    {isPercentage ? `${value1}%` : value1?.toLocaleString()}
                </span>
            </div>
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm">User 2</span>
                <span className="font-semibold">
                    {isPercentage ? `${value2}%` : value2?.toLocaleString()}
                </span>
            </div>
            <div
                className={`text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isPositive ? "+" : ""}
                {isPercentage
                    ? `${absDifference}%`
                    : absDifference.toLocaleString()}{" "}
                difference
            </div>
        </div>
    );
};
