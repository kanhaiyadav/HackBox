import { ProfileAnalysis } from "@/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function RepoStats({ profile }: { profile: ProfileAnalysis }) {
    const { repos, repoSizeDistribution } = profile;

    // Top 5 starred repos
    const topStarredRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    // Recent activity (last 5 updated repos)
    const recentActivityRepos = [...repos]
        .sort(
            (a, b) =>
                new Date(b.pushed_at).getTime() -
                new Date(a.pushed_at).getTime()
        )
        .slice(0, 5);

    // Prepare data for repo size distribution chart
    const sizeDistributionData = [
        { name: "Small (<10 stars)", value: repoSizeDistribution.small },
        { name: "Medium (10-99 stars)", value: repoSizeDistribution.medium },
        { name: "Large (100+ stars)", value: repoSizeDistribution.large },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h4 className="font-medium mb-4">
                    Repository Size Distribution
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sizeDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#8884d8"
                                name="Repositories"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-medium mb-4">
                        Top Starred Repositories
                    </h4>
                    <div className="space-y-3">
                        {topStarredRepos.map((repo) => (
                            <RepoItem
                                key={repo.id}
                                repo={repo}
                                metric={repo.stargazers_count}
                                metricName="stars"
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-4">
                        Recently Active Repositories
                    </h4>
                    <div className="space-y-3">
                        {recentActivityRepos.map((repo) => (
                            <RepoItem
                                key={repo.id}
                                repo={repo}
                                metric={new Date(
                                    repo.pushed_at
                                ).toLocaleDateString()}
                                metricName="last push"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const RepoItem = ({
    repo,
    metric,
    metricName,
}: {
    repo: any;
    metric: string | number;
    metricName: string;
}) => (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100">
        <div className="flex justify-between items-start">
            <div>
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                >
                    {repo.name}
                </a>
                {repo.description && (
                    <p className="text-sm text-gray-600 mt-1">
                        {repo.description}
                    </p>
                )}
            </div>
            <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                {metric} {metricName}
            </div>
        </div>
        {repo.language && (
            <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {repo.language}
                </span>
            </div>
        )}
    </div>
);
