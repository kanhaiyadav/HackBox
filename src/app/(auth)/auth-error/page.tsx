"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { BiRightArrow } from "react-icons/bi";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Create a separate component that uses the hook
function AuthErrorContent() {
    // Use the hook to get search params
    const searchParams = useSearchParams();

    // Extract error information from URL parameters
    const code = searchParams.get("code") || "Unknown";
    const title = searchParams.get("title") || "Authentication Error";
    const description =
        searchParams.get("description") ||
        "An error occurred during authentication.";
    const suggestion =
        searchParams.get("suggestion") ||
        "Please try again or contact support if the problem persists.";
    const btnText = searchParams.get("btntext") || "Verify Email";
    const btnLink = searchParams.get("btnlink") || "/verify-email";

    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
            <div className="text-center">
                <div className="mb-4 flex justify-center">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                </div>

                <div className="bg-transparent foreground shadow-inset rounded-lg p-6 mb-6">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded mb-3">
                        Error {code}
                    </span>

                    <h1 className="text-2xl font-bold text-red-600 mb-3 capitalize">
                        {title}
                    </h1>

                    <p className="text-white/60 mb-6">{description}</p>

                    <div className="bg-accent p-4 rounded shadow-input">
                        <p className="text-sm text-white/70">
                            <strong>Suggestion:</strong> {suggestion}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button variant={"outline"}>Contact Us</Button>

                    <Link
                        href={btnLink}
                        className="px-4 py-2 text-sm font-medium text-black bg-primary rounded-md hover:bg-primary/80"
                    >
                        {btnText}
                    </Link>
                </div>
                <Link
                    href="/home"
                    className="flex items-center gap-2 text-sm hover:underline relative top-[25px] text-white/50 w-fit mx-auto"
                >
                    <span>Continue without verification</span>
                    <BiRightArrow />
                </Link>
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
export default function AuthErrorPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading error details...</p>
                </div>
            }
        >
            <AuthErrorContent />
        </Suspense>
    );
}
