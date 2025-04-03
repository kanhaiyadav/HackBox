import { GitHubUser, GitHubRepo, GitHubContributionCalendar, ProfileAnalysis, ComparisonResult } from "@/types";

const GITHUB_API = "https://api.github.com";

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
    const response = await fetch(`${GITHUB_API}/users/${username}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
    const response = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=100`
    );
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return response.json();
}

export async function fetchContributions(
    username: string
): Promise<GitHubContributionCalendar> {
    // Using GitHub's GraphQL API for contributions
    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) throw new Error("Failed to fetch contributions");

    const data = await response.json();
    return data.data.user.contributionsCollection.contributionCalendar;
}

export async function analyzeProfile(
    username: string
): Promise<ProfileAnalysis> {
    const [user, repos, contributions] = await Promise.all([
        fetchGitHubUser(username),
        fetchUserRepos(username),
        fetchContributions(username),
    ]);

    // Calculate language distribution
    const languages: Record<string, number> = {};
    let starCount = 0;
    let forkCount = 0;

    repos.forEach((repo: { stargazers_count: number; forks_count: number; language: string | number; }) => {
        starCount += repo.stargazers_count;
        forkCount += repo.forks_count;

        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    // Calculate repo size distribution (based on stars)
    const repoSizeDistribution = {
        small: repos.filter((r: { stargazers_count: number; }) => r.stargazers_count < 10).length,
        medium: repos.filter(
            (r: { stargazers_count: number; }) => r.stargazers_count >= 10 && r.stargazers_count < 100
        ).length,
        large: repos.filter((r: { stargazers_count: number; }) => r.stargazers_count >= 100).length,
    };

    // Calculate activity score (weighted combination of recent activity)
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    const recentActivity = repos
        .filter((r: { pushed_at: string | number | Date; }) => new Date(r.pushed_at) > threeMonthsAgo)
        .reduce(
            (sum: number, repo: { stargazers_count: number; forks_count: number; }) =>
                sum + (repo.stargazers_count * 0.5 + repo.forks_count * 0.3),
            0
        );

    const activityScore = Math.min(100, Math.round(recentActivity / 10));

    // Calculate impact score
    const impactScore = Math.min(
        100,
        Math.round(
            (starCount * 0.4 +
                forkCount * 0.3 +
                user.followers * 0.2 +
                contributions.total_contributions * 0.1) /
                10
        )
    );

    // Calculate trend score (recent activity vs historical)
    const trendScore = calculateTrendScore(repos, contributions);

    return {
        user,
        repos,
        contributions,
        languages,
        starCount,
        forkCount,
        repoSizeDistribution,
        activityScore,
        collaborationScore: calculateCollaborationScore(repos),
        impactScore,
        trendScore,
    };
}

export async function compareProfiles(username1: string, username2: string) {
    const [profile1, profile2] = await Promise.all([
        analyzeProfile(username1),
        analyzeProfile(username2),
    ]);

    const comparisonResult: ComparisonResult = {
        user1: profile1,
        user2: profile2,
        differences: {
            stars: profile1.starCount - profile2.starCount,
            forks: profile1.forkCount - profile2.forkCount,
            contributions:
                profile1.contributions.total_contributions -
                profile2.contributions.total_contributions,
            followers: profile1.user.followers - profile2.user.followers,
            publicRepos:
                profile1.user.public_repos - profile2.user.public_repos,
            activityScore: profile1.activityScore - profile2.activityScore,
            impactScore: profile1.impactScore - profile2.impactScore,
        },
        commonLanguages: getCommonLanguages(
            profile1.languages,
            profile2.languages
        ),
        uniqueLanguages: {
            user1: getUniqueLanguages(profile1.languages, profile2.languages),
            user2: getUniqueLanguages(profile2.languages, profile1.languages),
        },
        relativeStrengths: calculateRelativeStrengths(profile1, profile2),
    };

    return comparisonResult;
}

// Helper functions
function calculateTrendScore(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    repos: GitHubRepo[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contributions: GitHubContributionCalendar
): number {
    // Implementation would analyze recent activity vs historical patterns
    return Math.floor(Math.random() * 100); // Placeholder
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateCollaborationScore(repos: GitHubRepo[]): number {
    // Implementation would analyze forks, collaborators, etc.
    return Math.floor(Math.random() * 100); // Placeholder
}

function getCommonLanguages(
    lang1: Record<string, number>,
    lang2: Record<string, number>
): string[] {
    const languages1 = new Set(Object.keys(lang1));
    const languages2 = new Set(Object.keys(lang2));
    return Array.from(
        new Set([...languages1].filter((x) => languages2.has(x)))
    );
}

function getUniqueLanguages(
    userLangs: Record<string, number>,
    otherLangs: Record<string, number>
): string[] {
    const userLanguages = new Set(Object.keys(userLangs));
    const otherLanguages = new Set(Object.keys(otherLangs));
    return Array.from(
        new Set([...userLanguages].filter((x) => !otherLanguages.has(x)))
    );
}

function calculateRelativeStrengths(
    profile1: ProfileAnalysis,
    profile2: ProfileAnalysis
) {
    const strengths1: string[] = [];
    const strengths2: string[] = [];

    if (profile1.starCount > profile2.starCount * 1.5)
        strengths1.push("Popularity (Stars)");
    if (profile2.starCount > profile1.starCount * 1.5)
        strengths2.push("Popularity (Stars)");

    if (profile1.forkCount > profile2.forkCount * 1.5)
        strengths1.push("Project Reuse (Forks)");
    if (profile2.forkCount > profile1.forkCount * 1.5)
        strengths2.push("Project Reuse (Forks)");

    if (
        profile1.contributions.total_contributions >
        profile2.contributions.total_contributions * 1.5
    )
        strengths1.push("Activity (Contributions)");
    if (
        profile2.contributions.total_contributions >
        profile1.contributions.total_contributions * 1.5
    )
        strengths2.push("Activity (Contributions)");

    if (profile1.activityScore > profile2.activityScore + 20)
        strengths1.push("Recent Activity");
    if (profile2.activityScore > profile1.activityScore + 20)
        strengths2.push("Recent Activity");

    if (
        Object.keys(profile1.languages).length >
        Object.keys(profile2.languages).length * 1.5
    )
        strengths1.push("Language Diversity");
    if (
        Object.keys(profile2.languages).length >
        Object.keys(profile1.languages).length * 1.5
    )
        strengths2.push("Language Diversity");

    return {
        user1: strengths1,
        user2: strengths2,
    };
}
