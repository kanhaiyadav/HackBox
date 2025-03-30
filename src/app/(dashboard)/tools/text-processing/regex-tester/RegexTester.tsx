'use client';

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/debounce";


type RegexFlags = {
    global: boolean;
    ignoreCase: boolean;
    multiline: boolean;
    dotAll: boolean;
    unicode: boolean;
    sticky: boolean;
};

type MatchResult = {
    match: string;
    index: number;
    groups: Record<string, string> | undefined;
};

export default function RegexTester() {
    const [regexInput, setRegexInput] = useState<string>("");
    const [testString, setTestString] = useState<string>(
        "Enter your test string here...\nSample text with 123 numbers and special characters!@#"
    );
    const [substitution, setSubstitution] = useState<string>("");
    const [flags, setFlags] = useState<RegexFlags>({
        global: true,
        ignoreCase: false,
        multiline: false,
        dotAll: false,
        unicode: false,
        sticky: false,
    });
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [substitutedText, setSubstitutedText] = useState<string>("");
    const [isValidRegex, setIsValidRegex] = useState<boolean>(true);
    const [regexError, setRegexError] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"matches" | "substitution">(
        "matches"
    );
    const [explanation, setExplanation] = useState<string>("");

    const debouncedRegexInput = useDebounce(regexInput, 300);
    const debouncedTestString = useDebounce(testString, 300);
    const debouncedSubstitution = useDebounce(substitution, 300);

    // Update matches and validation when inputs change
    useEffect(() => {
        try {
            if (!debouncedRegexInput) {
                setIsValidRegex(true);
                setMatches([]);
                setSubstitutedText(debouncedTestString);
                setRegexError("");
                setExplanation("");
                return;
            }

            const activeFlags = Object.entries(flags)
                .filter(([_, value]) => value)
                .map(([key]) => key[0]) // Take first letter of each flag
                .join("");

            const regex = new RegExp(debouncedRegexInput, activeFlags);
            setIsValidRegex(true);
            setRegexError("");

            // Get all matches
            const matchArray: MatchResult[] = [];
            let match;
            while ((match = regex.exec(debouncedTestString)) !== null) {
                matchArray.push({
                    match: match[0],
                    index: match.index,
                    groups: match.groups || undefined,
                });

                if (!flags.global) break; // Only first match if not global
            }
            setMatches(matchArray);

            // Perform substitution if in substitution tab
            if (activeTab === "substitution" && debouncedSubstitution !== "") {
                setSubstitutedText(
                    debouncedTestString.replace(regex, debouncedSubstitution)
                );
            } else {
                setSubstitutedText(debouncedTestString);
            }

            // Generate explanation
            generateExplanation(debouncedRegexInput, activeFlags);
        } catch (err) {
            setIsValidRegex(false);
            setRegexError(
                err instanceof Error
                    ? err.message
                    : "Invalid regular expression"
            );
            setMatches([]);
            setSubstitutedText(debouncedTestString);
            setExplanation("");
        }
    }, [
        debouncedRegexInput,
        debouncedTestString,
        debouncedSubstitution,
        flags,
        activeTab,
    ]);

    const toggleFlag = (flag: keyof RegexFlags) => {
        setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
    };

    const generateExplanation = (pattern: string, flags: string) => {
        try {
            const explanations: string[] = [];

            // Basic pattern explanation
            explanations.push(`Pattern: /${pattern}/${flags}`);

            // Flags explanation
            const flagExplanations: string[] = [];
            if (flags.includes("g"))
                flagExplanations.push("global (all matches)");
            if (flags.includes("i")) flagExplanations.push("case insensitive");
            if (flags.includes("m"))
                flagExplanations.push(
                    "multiline (^ and $ match start/end of line)"
                );
            if (flags.includes("s"))
                flagExplanations.push("dotAll (. matches newlines)");
            if (flags.includes("u"))
                flagExplanations.push("unicode (handle surrogate pairs)");
            if (flags.includes("y"))
                flagExplanations.push("sticky (matches only from lastIndex)");

            if (flagExplanations.length) {
                explanations.push(`Flags: ${flagExplanations.join(", ")}`);
            }

            // Character classes
            if (/\\[dwsDWS]/.test(pattern)) {
                const charClasses: string[] = [];
                if (/\\d/.test(pattern)) charClasses.push("\\d (digit)");
                if (/\\w/.test(pattern))
                    charClasses.push("\\w (word character)");
                if (/\\s/.test(pattern)) charClasses.push("\\s (whitespace)");
                if (/\\D/.test(pattern)) charClasses.push("\\D (not digit)");
                if (/\\W/.test(pattern))
                    charClasses.push("\\W (not word character)");
                if (/\\S/.test(pattern))
                    charClasses.push("\\S (not whitespace)");
                explanations.push(
                    `Character classes: ${charClasses.join(", ")}`
                );
            }

            // Quantifiers
            if (/[*+?{}]/.test(pattern)) {
                const quantifiers: string[] = [];
                if (/\*/.test(pattern)) quantifiers.push("* (0 or more)");
                if (/\+/.test(pattern)) quantifiers.push("+ (1 or more)");
                if (/\?/.test(pattern)) quantifiers.push("? (0 or 1)");
                if (/\{[0-9,]+\}/.test(pattern))
                    quantifiers.push("{} (custom quantifier)");
                explanations.push(`Quantifiers: ${quantifiers.join(", ")}`);
            }

            // Anchors
            if (/[\^$]/.test(pattern)) {
                const anchors: string[] = [];
                if (/\^/.test(pattern))
                    anchors.push("^ (start of line/string)");
                if (/\$/.test(pattern)) anchors.push("$ (end of line/string)");
                explanations.push(`Anchors: ${anchors.join(", ")}`);
            }

            // Groups
            if (/[()]/.test(pattern)) {
                const groups: string[] = [];
                if (/\([^?]/.test(pattern)) groups.push("() (capturing group)");
                if (/\(\?:/.test(pattern))
                    groups.push("(?:) (non-capturing group)");
                if (/\(\?<[^>]+>/.test(pattern))
                    groups.push("(?<name>) (named capturing group)");
                explanations.push(`Groups: ${groups.join(", ")}`);
            }

            setExplanation(explanations.join("\n\n"));
        } catch (err) {
            setExplanation("Could not generate explanation");
        }
    };

    const getHighlightedText = () => {
        if (!matches.length || !isValidRegex) return testString;

        let result = [];
        let lastIndex = 0;

        matches.forEach((match) => {
            // Add text before the match
            if (match.index > lastIndex) {
                result.push(testString.substring(lastIndex, match.index));
            }

            // Add the matched text with highlight
            result.push(
                <mark
                    key={match.index}
                    className="bg-yellow-200 dark:bg-yellow-600"
                >
                    {match.match}
                </mark>
            );

            lastIndex = match.index + match.match.length;
        });

        // Add remaining text after last match
        if (lastIndex < testString.length) {
            result.push(testString.substring(lastIndex));
        }

        return result;
    };

    return (
        <div className="p-3 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regex Input */}
                <div className="space-y-2">
                    <label
                        htmlFor="regex"
                        className="block text-sm font-medium text-white/80"
                    >
                        Regular Expression
                    </label>
                    <div className="flex shadow-input">
                        <span className="inline-flex items-center px-3 rounded-l-md bg-accent text-gray-500">
                            /
                        </span>
                        <input
                            id="regex"
                            type="text"
                            value={regexInput}
                            onChange={(e) => setRegexInput(e.target.value)}
                            className="foreground flex-1 min-w-0 block w-full px-3 py-4 rounded-none focus:border-none focus:outline-none"
                            placeholder="Enter your regex pattern"
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md bg-accent text-gray-500">
                            /
                            {Object.entries(flags)
                                .filter(([_, value]) => value)
                                .map(([key]) => key[0])
                                .join("")}
                        </span>
                    </div>
                    {!isValidRegex && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {regexError}
                        </p>
                    )}
                </div>

                {/* Flags */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">
                        Flags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(flags).map(([flag, isActive]) => (
                            <button
                                key={flag}
                                onClick={() =>
                                    toggleFlag(flag as keyof RegexFlags)
                                }
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
                                    isActive
                                        ? "bg-primary/10 text-primary outline-1 outline-primary"
                                        : "bg-accent text-white/60 outline-1 outline-white/60"
                                }`}
                            >
                                {flag[0]} - {flag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/60 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("matches")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "matches"
                                ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-white/60 hover:text-white/80 "
                        }`}
                    >
                        Matches
                    </button>
                    <button
                        onClick={() => setActiveTab("substitution")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "substitution"
                                ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400"
                                : "border-transparent text-white/60 hover:text-white/80"
                        }`}
                    >
                        Substitution
                    </button>
                </nav>
            </div>

            {/* Test String */}
            <div className="space-y-2">
                <label
                    htmlFor="testString"
                    className="block text-sm font-medium text-white/80"
                >
                    Test String
                </label>
                <textarea
                    id="testString"
                    rows={6}
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="block w-full px-3 py-2 foreground rounded-md shadow-input focus:outline-1 outline-accent"
                    placeholder="Enter text to test against"
                />
            </div>

            {activeTab === "substitution" && (
                <div className="space-y-2">
                    <label
                        htmlFor="substitution"
                        className="block text-sm font-medium text-white/80 dark:text-gray-300"
                    >
                        Substitution
                    </label>
                    <input
                        id="substitution"
                        type="text"
                        value={substitution}
                        onChange={(e) => setSubstitution(e.target.value)}
                        className="block w-full px-3 py-4 foreground shadow-input rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="Enter replacement text"
                    />
                </div>
            )}

            {/* Results */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white/80">
                    {activeTab === "matches"
                        ? "Matches"
                        : "Substitution Result"}
                </h2>

                {activeTab === "matches" ? (
                    <>
                        <div className="p-4 foreground shadow-input rounded-md whitespace-pre-wrap">
                            {getHighlightedText()}
                        </div>

                        {matches.length > 0 ? (
                            <div className="overflow-x-auto shadow-input rounded-md">
                                <table className="min-w-full divide-y divide-accent foreground">
                                    <thead className="">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                                                Match
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                                                Groups
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-accent">
                                        {matches.map((match, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white/80 ">
                                                    {match.match}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 ">
                                                    {match.index}-
                                                    {match.index +
                                                        match.match.length}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white/80 ">
                                                    {match.groups ? (
                                                        <pre className="text-xs">
                                                            {JSON.stringify(
                                                                match.groups,
                                                                null,
                                                                2
                                                            )}
                                                        </pre>
                                                    ) : (
                                                        "None"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : isValidRegex && regexInput ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No matches found
                            </p>
                        ) : null}
                    </>
                ) : (
                    <div className="p-4 foreground shadow-input rounded-md whitespace-pre-wrap">
                        {substitutedText}
                    </div>
                )}
            </div>

            {/* Explanation */}
            {explanation && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white/80 dark:text-white">
                        Explanation
                    </h2>
                    <div className="p-4 foreground shadow-inset rounded-md whitespace-pre-wrap font-mono text-sm">
                        {explanation}
                    </div>
                </div>
            )}

            {/* Cheat Sheet */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white/80 dark:text-white">
                    Regex Cheat Sheet
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 foreground shadow-inset rounded-md">
                        <h3 className="font-medium mb-2">Character Classes</h3>
                        <ul className="text-sm space-y-1">
                            <li>
                                <code>.</code> - Any character except newline
                            </li>
                            <li>
                                <code>\d</code> - Digit (0-9)
                            </li>
                            <li>
                                <code>\D</code> - Not a digit
                            </li>
                            <li>
                                <code>\w</code> - Word character (a-z, A-Z, 0-9,
                                _)
                            </li>
                            <li>
                                <code>\W</code> - Not a word character
                            </li>
                            <li>
                                <code>\s</code> - Whitespace (space, tab,
                                newline)
                            </li>
                            <li>
                                <code>\S</code> - Not whitespace
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 foreground shadow-inset rounded-md">
                        <h3 className="font-medium mb-2">Quantifiers</h3>
                        <ul className="text-sm space-y-1">
                            <li>
                                <code>*</code> - 0 or more
                            </li>
                            <li>
                                <code>+</code> - 1 or more
                            </li>
                            <li>
                                <code>?</code> - 0 or 1
                            </li>
                            <li>
                                <code>{"{3}"}</code> - Exactly 3
                            </li>
                            <li>
                                <code>{"{3,}"}</code> - 3 or more
                            </li>
                            <li>
                                <code>{"{3,5}"}</code> - 3, 4, or 5
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 foreground shadow-inset rounded-md">
                        <h3 className="font-medium mb-2">Anchors</h3>
                        <ul className="text-sm space-y-1">
                            <li>
                                <code>^</code> - Start of string/line
                            </li>
                            <li>
                                <code>$</code> - End of string/line
                            </li>
                            <li>
                                <code>\b</code> - Word boundary
                            </li>
                            <li>
                                <code>\B</code> - Not word boundary
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
