import {
    SquareTerminal,
    SquareKanban,
    CircleDollarSign,
    Gamepad2,
    BookOpenIcon,
    ShieldCheck,
    Shuffle,
    CircleUser,
    Palette,
} from "lucide-react";

export const toolCategories = [
    {
        title: "Developer & Tech",
        slug: "developer-tech",
        icon: SquareTerminal,
    },
    {
        title: "Productivity & Work",
        slug: "productivity-work",
        icon: SquareKanban,
    },
    {
        title: "Design & Media",
        slug: "design-media",
        icon: Palette,
    },
    {
        title: "Social Media & Fun",
        slug: "social-media-fun",
        icon: CircleUser,
    },
    {
        title: "Finance & Business",
        slug: "finance-business",
        icon: CircleDollarSign,
    },
    {
        title: "Gaming & Entertainment",
        slug: "gaming-entertainment",
        icon: Gamepad2,
    },
    {
        title: "Learning & Educational",
        slug: "learning-educational",
        icon: BookOpenIcon,
    },
    {
        title: "Security & Privacy",
        slug: "security-privacy",
        icon: ShieldCheck,
    },
    {
        title: "Miscellaneous",
        slug: "miscellaneous",
        icon: Shuffle,
    },
];
