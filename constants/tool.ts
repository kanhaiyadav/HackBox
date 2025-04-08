import {
    SquareTerminal,
    SquareKanban,
    // CircleDollarSign,
    // Gamepad2,
    // BookOpenIcon,
    ShieldCheck,
    Shuffle,
    CircleUser,
    Palette,
    LucideTextSearch,
    ChartNoAxesCombined,
    ArrowLeftRight
} from "lucide-react";

export const toolCategories = [
    {
        title: "Developer & Tech",
        slug: "developer-tech",
        icon: SquareTerminal,
    },
    {
        title: "Color Manupulation",
        slug: "color-manipulation",
        icon: Palette,
    },
    {
        title: "Text Processing",
        slug: "text-processing",
        icon: LucideTextSearch,
    },
    {
        title: "Productivity & Work",
        slug: "productivity-work",
        icon: SquareKanban,
    },
    {
        title: "Fun",
        slug: "fun",
        icon: CircleUser,
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
    {
        title: "Data Analysis",
        slug: "data-analysis",
        icon: ChartNoAxesCombined,
    },
    {
        title: "Conversion & Calculators",
        slug: "conversion-calculators",
        icon: ArrowLeftRight,
    },
];
