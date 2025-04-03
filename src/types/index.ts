export interface ITool {
    name: string;
    description: string;
    warning: string;
    slug: string;
    category: string;
    categorySlug: string;
    stars: number;
    tags: string[];
}

export interface ToolsState {
    tools: ITool[];
    loading: boolean;
    error: null | string;
}

export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name: string;
    company: string;
    blog: string;
    location: string;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    language: string;
    license?: {
        key: string;
        name: string;
    };
}

export interface GitHubContribution {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionCalendar {
    total_contributions: number;
    weeks: {
        contributionDays: GitHubContribution[];
    }[];
}

export interface ProfileAnalysis {
    user: GitHubUser;
    repos: GitHubRepo[];
    contributions: GitHubContributionCalendar;
    languages: Record<string, number>;
    starCount: number;
    forkCount: number;
    repoSizeDistribution: {
        small: number;
        medium: number;
        large: number;
    };
    activityScore: number;
    collaborationScore: number;
    impactScore: number;
    trendScore: number;
}

export interface ComparisonResult {
    user1: ProfileAnalysis;
    user2: ProfileAnalysis;
    differences: {
        stars: number;
        forks: number;
        contributions: number;
        followers: number;
        publicRepos: number;
        activityScore: number;
        impactScore: number;
    };
    commonLanguages: string[];
    uniqueLanguages: {
        user1: string[];
        user2: string[];
    };
    relativeStrengths: {
        user1: string[];
        user2: string[];
    };
}