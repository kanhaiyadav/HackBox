"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

type VerificationResponse = {
    error: string | null;
};

const VerifyForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const email = e.currentTarget.email.value;

            // Call the server action through a regular API endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/send-verification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data: VerificationResponse = await response.json();
            console.log(data);

            if (!data.error) {
                toast.success("Verification email sent! Please check your inbox.");
            } else {
                toast.error(data.error || "Failed to send verification email. Please try again.");
            }
        } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <form
                className="flex flex-col gap-4 mt-2 w-full"
                onSubmit={handleSubmit}
            >
                <Input type="email" name="email" placeholder="Email" required />
                <Button
                    type="submit"
                    className="hover:bg-primary/80 text-black"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Sending..." : "Verify"}
                </Button>
            </form>
        </div>
    );
};

export default VerifyForm;
