import {
    AudioWaveform,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    SquareTerminal,
    SquareKanban,
    CircleDollarSign,
    Gamepad2,
    BookOpenIcon,
    ShieldCheck,
    Shuffle,
    CircleUser,
    Palette
} from "lucide-react";

export const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Developer & Tech",
            url: "developer-tech",
            icon: SquareTerminal,
            items: [
                {
                    title: "JSON Formatter & Validator",
                    url: "json-formatter-validator",
                },
                {
                    title: "JWT Decoder",
                    url: "jwt-decoder",
                },
                {
                    title: "API Status Checker",
                    url: "api-status-checker",
                },
                {
                    title: "Color Code Converter",
                    url: "color-code-converter",
                },
                {
                    title: "Hash Generator",
                    url: "hash-generator",
                },
                {
                    title: "HTML to Markdown Converter",
                    url: "html-to-markdown-converter",
                },
                {
                    title: "Markdown Editor",
                    url: "markdown-editor",
                },
                {
                    title: "Text Manupulator",
                    url: "text-manupulator",
                },
                {
                    title: "JSON placeholder",
                    url: "json-placeholder",
                },
                {
                    title:"HTTP Status Code lookup",
                    url:"http-status-code-lookup"
                }, 
                {
                    title: "Css unit converter",
                    url: "css-unit-converter"
                }
            ],
        },
        {
            title: "Productivity & Work",
            url: "productivity-work",
            icon: SquareKanban,
            items: [
                {
                    title: "Pomodoro Timer",
                    url: "pomodoro-timer",
                },
                {
                    title: "To-Do",
                    url: "to-do",
                },
                {
                    title: "Habit Tracker",
                    url: "habit-tracker",
                },
                {
                    title: "Invoice Generator",
                    url: "habit-tracker",
                },
            ],
        },
        {
            title: "Design & Media",
            url: "#",
            icon: Palette,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Social Media & Fun",
            url: "social-media-fun",
            icon: CircleUser,
            items: [
                {
                    title: "GitHub Profile Analyzer",
                    url: "github-profile-analyzer",
                },
                {
                    title: "Instagram Hastag generator",
                    url: "instagram-hashtag",
                },
                {
                    title: "YouTube Video Summarizer",
                    url: "youtube-video-summarizer",
                },
                {
                    title: "Twitter Thread to Blog Converter",
                    url: "twitter-thread-to-blog-converter",
                },
                {
                    title: "'Am I Internet Famous?' Checker",
                    url: "am-i-internet-famous",
                },
                {
                    title: "Spotify Playlist Analyzer",
                    url: "spotify-playlist-analyzer",
                },
                {
                    title: "Twitch Stream Checker",
                    url: "twitch-stream-checker",
                },
                {
                    title: "Fake News Detector",
                    url: "fake-news-detector",
                },
                {
                    title: "LinkedIn Profile Strength Checker",
                    url: "linkedin-profile-strength-checker",
                },
            ],
        },
        {
            title: "Finance & Business",
            url: "finance-business",
            icon: CircleDollarSign,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
        {
            title: "Gaming & Entertainment",
            url: "#",
            icon: Gamepad2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
        {
            title: "Learning & Educational",
            url: "#",
            icon: BookOpenIcon,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
        {
            title: "Security & Privacy",
            url: "#",
            icon: ShieldCheck,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
        {
            title: "Miscellaneous",
            url: "#",
            icon: Shuffle,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};
