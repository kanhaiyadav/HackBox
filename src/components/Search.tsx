"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllTools } from "@/lib/features/tools/tools.selector";
import { Search as SearchIcon } from "lucide-react";
import { BsTools } from "react-icons/bs";
import Link from "next/link";

const Search = () => {
    const allTools = useSelector(selectAllTools)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort once at the start

    const [searchQuery, setSearchQuery] = useState("");

    // Use useMemo to memoize the filtered and sorted tools
    const filteredTools = useMemo(() => {
        // If search query is empty, return all tools
        if (!searchQuery.trim()) return allTools;

        const queryLower = searchQuery.toLowerCase();

        // Separate tools into two groups
        const startsWithTools = allTools.filter((tool) =>
            tool.name.toLowerCase().startsWith(queryLower)
        );

        const includesTools = allTools.filter((tool) => {
            const toolNameLower = tool.name.toLowerCase();
            // Exclude tools that already start with the query to avoid duplicates
            return (
                toolNameLower.includes(queryLower) &&
                !toolNameLower.startsWith(queryLower)
            );
        });

        // Combine the two groups, with startsWith tools first
        return [...startsWithTools, ...includesTools];
    }, [allTools, searchQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-4">
                <SearchIcon className="text-white" />
                <input
                    onChange={handleChange}
                    type="text"
                    value={searchQuery}
                    className="border-none outline-none bg-transparent w-[85%] text-lg placeholder:text-white/30"
                    placeholder="Search a tool"
                />
            </div>
            <hr className="border-white/10 mt-[20px] mb-[10px]" />
            <div className="h-[250px] overflow-y-auto styled-scrollbar pr-1">
                {
                    // If no tools found, show a message
                    filteredTools.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-sm text-white/30 text-center">
                                No tools found
                            </p>
                        </div>
                    )
                }
                <div className="flex flex-col group mr-1">
                    {filteredTools.map((tool, index) => (
                        <Link
                            href={`/tools/${tool.categorySlug}/${tool.slug}`}
                            key={index}
                            className="
                flex items-center gap-3 w-full rounded-lg py-2 px-3
                first:bg-accent
                group-hover:first:bg-transparent
                group-hover:first:hover:bg-accent
                hover:bg-accent
              "
                        >
                            <BsTools className="text-white" />
                            <div>
                                <h3 className="text-sm text-white">
                                    {tool.name}
                                </h3>
                                <p className="text-white/50 text-xs mt-[-1px]">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
