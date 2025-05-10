"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
    InstantSearch,
    SearchBox,
    Hits,
    Highlight,
    RefinementList,
} from "react-instantsearch";
import Image from "next/image";

function Hit({ hit }) {
    return (
        <article className="flex items-center gap-3 w-full rounded-lg py-2 px-3 hover:bg-accent">
            <Image
                src={`/tools/${hit?.categorySlug}/${hit?.slug}.png`}
                alt={hit.name}
                width={35}
                height={35}
            />
            {hit.categories?.length > 0 && (
                <p className="text-sm text-white/50">{hit.categories[0]}</p>
            )}
            <h1>
                <Highlight attribute="name" hit={hit} />
            </h1>
        </article>
    );
}

const searchClient = algoliasearch(
    "XLP82CNMLF",
    "5962097dc35d708b6ecc81087cef8e71"
);

const Search = () => {
    return (
        <div className="w-full">
            {/* <div className="flex items-center gap-4">
                <SearchIcon className="text-white" />
                <input
                    onChange={handleChange}
                    type="text"
                    value={searchQuery}
                    className="border-none outline-none bg-transparent w-[85%] text-lg placeholder:text-white/30"
                    placeholder="Search a tool"
                    autoFocus
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
            </div> */}
            <InstantSearch
                searchClient={searchClient}
                indexName="HackBox.tools"
            >
                <SearchBox />
                <RefinementList attribute="category" />
                <div className="w-full max-h-[350px] overflow-y-auto styled-scrollbar pr-1">
                    <Hits hitComponent={Hit} />
                </div>
            </InstantSearch>
        </div>
    );
};

export default Search;
