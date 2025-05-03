"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { FiChevronRight, FiLock, FiMail } from "react-icons/fi";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithCredentials } from "@/actions/auth";
import { BiError } from "react-icons/bi";

const signinFormSchema = z.object({
    email: z
        .string()
        .min(1, "email is required")
        .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type SigninFormType = z.infer<typeof signinFormSchema>;

// This component uses useSearchParams and will be wrapped in Suspense
const SigninFormContent = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailVerified = searchParams.get("emailVerified");
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(signinFormSchema),
    });

    useEffect(() => {
        if (!hasMounted) {
            setHasMounted(true);
        }
    }, [hasMounted]);

    useEffect(() => {
        if (hasMounted && emailVerified === "true") {
            setTimeout(() => {
                toast("Email verified successfully. You can now sign in.");
            }, 200);
        }
    }, [emailVerified, hasMounted]);

    const [rememberMe, setRememberMe] = useState(false);

    interface ErrorResponse { 
        error: string;
        data?: {
            action?: {
                label: string;
                url: string;
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user?: any;
        };
    }

    const formSubmitHandler: SubmitHandler<SigninFormType> = async (data) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            })

            const resJson:ErrorResponse = await res.json()

            if (resJson.error) {
                if(resJson.data?.action) {
                    toast.error(resJson.error, {
                        action: {
                            label: resJson.data?.action?.label || "Action",
                            onClick: () => router.push(resJson.data?.action?.url || "/"),
                        },
                    });
                } else {
                    toast.error(resJson.error);
                }
                return;
            }

            const user = resJson?.data?.user;
            
            const result = await signInWithCredentials({ user });
            console.log("Sign in result:", result);
            router.push("/home");
            reset();
        } catch (error) {
            console.error("Sign in error:", error);
            setError("An error occurred during sign in. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(formSubmitHandler)} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                    Email
                </Label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        id="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...register("email")}
                    />
                </div>
                {errors.email && (
                    <p className="flex gap-1 items-center text-red-400 text-xs mt-[-4px]">
                        <BiError className="text-sm" />{" "}
                        <span>{errors.email.message}</span>
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-300">
                        Password
                    </Label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-cyan-300"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                        {...register("password")}
                    />
                </div>
                {errors.password && (
                    <p className="flex gap-1 items-center text-red-400 text-xs mt-[-4px]">
                        <BiError className="text-sm" />{" "}
                        <span>{errors.password.message}</span>
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                    }
                    className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                <Label
                    htmlFor="remember"
                    className="text-sm text-gray-300 cursor-pointer"
                >
                    Remember me for 30 days
                </Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Signing in..." : "Sign in"}
                {!isSubmitting && <FiChevronRight className="ml-2" />}
            </Button>
        </form>
    );
};

// Loading fallback for Suspense
const SigninFormLoading = () => {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-700/30 rounded"></div>
            <div className="space-y-2">
                <div className="h-5 w-16 bg-gray-700/30 rounded"></div>
                <div className="h-10 bg-gray-700/30 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <div className="h-5 w-20 bg-gray-700/30 rounded"></div>
                    <div className="h-5 w-32 bg-gray-700/30 rounded"></div>
                </div>
                <div className="h-10 bg-gray-700/30 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-700/30 rounded"></div>
                <div className="h-5 w-48 bg-gray-700/30 rounded"></div>
            </div>
            <div className="h-10 bg-gray-700/30 rounded"></div>
        </div>
    );
};

// Main component with Suspense boundary
const SigninForm = () => {
    return (
        <Suspense fallback={<SigninFormLoading />}>
            <SigninFormContent />
        </Suspense>
    );
};

export default SigninForm;
