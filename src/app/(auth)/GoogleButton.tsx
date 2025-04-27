import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaGoogle } from "react-icons/fa";

const GoogleBtton = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/home" });
            }}
        >
            <Button
                variant={"outline"}
                type="submit"
                className="border-primary bg-primary/5 text-primary w-full"
            >
                <FaGoogle className="h-4 w-4" />{" "}
                <span className="hidden xs:block">Google</span>
            </Button>
        </form>
    );
};

export default GoogleBtton;
