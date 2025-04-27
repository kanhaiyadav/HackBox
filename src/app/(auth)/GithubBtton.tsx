import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";
import { TbBrandGithubFilled } from "react-icons/tb";

const GithubBtton = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/home" });
            }}
        >
            <Button
                variant="outline"
                className="border-primary bg-primary/5 text-primary w-full"
            >
                <TbBrandGithubFilled className="text-xl" />
                <span className="hidden xs:block">GitHub</span>
            </Button>
        </form>
    );
};

export default GithubBtton;
