"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { sendMagicLink, sendResetPasswordLink } from "@/actions/auth";
import { toast } from "sonner";

const MagicLinkForm = ({ emailType }: {
    emailType: "reset" | "magic" | undefined;
}) => {
    const handleSubmit = async (formData: FormData) => {
        if(emailType === "magic") {
            const res = await sendMagicLink(formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Magic link sent to your email address.");
            }
        } else {
            const res = await sendResetPasswordLink(formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Reset password link sent to your email address.");
            }
        }
    };
    
    return (
        <form action={handleSubmit}>
            <Input
                name="email"
                id="email"
                type="email"
                placeholder="Your email address"
            />
            <Button className="w-full mt-4">Send Email</Button>
        </form>
    );
};

export default MagicLinkForm;
