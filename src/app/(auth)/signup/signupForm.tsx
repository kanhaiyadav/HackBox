"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { FiChevronRight, FiLock, FiMail } from "react-icons/fi";

const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setError(null);
        setIsLoading(true);

        // Simulating API call
        try {
            // Here you would normally make your authentication API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For demo purposes, we'll just redirect to a success page
            console.log("Sign-in successful");
            // Router.push('/dashboard') - would go here in a real app
        } catch (err) {
            console.error("Sign-in error:", err);
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                    Email
                </Label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                    Password
                </Label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                    Confirm Password
                </Label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Signing in..." : "Sign in"}
                {!isLoading && <FiChevronRight className="ml-2" />}
            </Button>
        </form>
    );
};

export default SignUpForm;
