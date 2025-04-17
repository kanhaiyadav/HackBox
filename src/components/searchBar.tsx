import React from "react";
import { LuSearch } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Search from "./Search";

const SearchBar = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex gap-2 items-center px-4 py-2 rounded-full bg-white/10">
                    <LuSearch className="text-white" />
                    <input
                        type="text"
                        placeholder={"Search a tool"}
                        className="bg-transparent border-none outline-none hidden sm:block"
                        readOnly
                    />
                </div>
            </DialogTrigger>
            <DialogContent>
                <VisuallyHidden>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </VisuallyHidden>
                <Search />
            </DialogContent>
        </Dialog>
    );
};

export default SearchBar;
