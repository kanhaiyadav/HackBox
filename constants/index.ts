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
                    title: "HTTP Status Code lookup",
                    url: "http-status-code-lookup",
                },
                {
                    title: "Css unit converter",
                    url: "css-unit-converter",
                },
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
                    url: "invoice-generator",
                },
            ],
        },
        {
            title: "Design & Media",
            url: "#",
            icon: Palette,
            items: [
                {
                    title: "Background Remover",
                    url: "background-remover",
                },
                {
                    title: "File Compressor",
                    url: "file-compressor",
                },
                {
                    title: "Color Palette Generator",
                    url: "color-palette-generator",
                },
                {
                    title: "File type Converter",
                    url: "file-type-converter",
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
                    url: "instagram-hashtag-generator",
                },
                {
                    title: "YouTube Video Summarizer",
                    url: "youtube-video-summarizer",
                },
                {
                    title: "Twitter Thread to Blog",
                    url: "twitter-thread-to-blog",
                },
                {
                    title: "Am I Internet Famous?",
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
                    title: "LinkedIn Profile Strength",
                    url: "linkedin-profile-strength",
                },
            ],
        },
        {
            title: "Finance & Business",
            url: "finance-business",
            icon: CircleDollarSign,
            items: [
                {
                    title: "Currency Converter",
                    url: "currency-converter",
                },
                {
                    title: "Stock Market Tracker",
                    url: "stock-market-tracker",
                },
                {
                    title: "Crypto Price Checker",
                    url: "crypto-price-checker",
                },
                {
                    title: "Loan Calculator",
                    url: "loan-calculator",
                },
                {
                    title: "Invoice Generator",
                    url: "invoice-generator",
                },
                {
                    title: "Budget Planner",
                    url: "budget-planner",
                },
                {
                    title: "Tax Calculator",
                    url: "tax-calculator",
                },
            ],
        },
        {
            title: "Gaming & Entertainment",
            url: "gaming-entertainment",
            icon: Gamepad2,
            items: [
                {
                    title: "Chess.com vs Lichess",
                    url: "chess-com-vs-lichess",
                },
                {
                    title: "Esports Schedule",
                    url: "esports-schedule",
                },
            ],
        },
        {
            title: "Learning & Educational",
            url: "learning-educational",
            icon: BookOpenIcon,
            items: [
                {
                    title: "Flashcard Maker",
                    url: "flashcard-maker",
                },
                {
                    title: "Language Translator",
                    url: "language-translator",
                },
                {
                    title: "Periodic Table Explorer",
                    url: "periodic-table-explorer",
                },
                {
                    title: "Random Trivia Generator",
                    url: "random-trivia-generator",
                },
            ],
        },
        {
            title: "Security & Privacy",
            url: "security-privacy",
            icon: ShieldCheck,
            items: [
                {
                    title: "Password Generator",
                    url: "password-generator",
                },
                {
                    title: "URL Safety Checker",
                    url: "url-safety-checker",
                },
                {
                    title: "IP Address Lookup",
                    url: "ip-address-lookup",
                },
            ],
        },
        {
            title: "Miscellaneous",
            url: "miscellaneous",
            icon: Shuffle,
            items: [
                {
                    title: "Random Name Picker",
                    url: "random-name-picker",
                },
                {
                    title: "Would You Rather?",
                    url: "would-you-rather",
                },
                {
                    title: "Zodiac Compatibility Checker",
                    url: "zodiac-compatibility-checker",
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
