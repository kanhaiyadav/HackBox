import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "HackBox",
        template: "%s | HackBox",
    },
    description:
        "A secret vault of online superpowers. analyze profiles, automate boring stuff, and pretend to be a hacker. Welcome to HackBox.",
    keywords: ["hackbox", "tools", "github-profile-comparison", "jwt-decoder"],
    authors: [{ name: "Kanhaiya Yadav" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="h-screen flex flex-col relative">
                    <main className="flex-1 flex items-center justify-center relative z-10">
                        <div className="w-full max-w-md">
                            {/* Back to home link */}
                            <Link
                                href="/"
                                className="flex items-center text-sm text-gray-400 hover:text-primary transition mb-2 mx-6 group"
                            >
                                <FiArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition" />
                                Back to home
                            </Link>

                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="py-6 px-4 relative z-10">
                        <div className="container mx-auto">
                            <div className="flex flex-col md:flex-row justify-center md:gap-4 items-center">
                                <p className="text-sm text-gray-400">
                                    © {new Date().getFullYear()} HackBox. All
                                    rights reserved.
                                </p>
                                <div className="flex space-x-4 mt-4 sm:mt-0">
                                    <Link
                                        href="/privacy"
                                        className="text-sm text-gray-400 hover:text-gray-400"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <Link
                                        href="/terms"
                                        className="text-sm text-gray-400 hover:text-gray-400"
                                    >
                                        Terms of Service
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="text-sm text-gray-400 hover:text-gray-400"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </footer>

                    {/* <div className="w-full h-full absolute top-0 left-0 z-8"/> */}

                    <img
                        src="/auth/Ellipse.svg"
                        alt=""
                        className="w-[300px] md:w-[400px] h-[300px] md:h-[400px] absolute left-0 top-[45%] md:top-[50%] translate-x-[-50%] translate-y-[-50%]"
                    />
                    <img
                        src="/auth/Subtract.svg"
                        alt=""
                        className="w-[220px] md:w-[300px] h-[220px] md:h-[300px] absolute right-0 top-0"
                    />
                    <img
                        src="/auth/Polygons.svg"
                        alt=""
                        className="w-[220px] md:w-[300px] h-[220px] md:h-[300px] absolute right-0 bottom-0"
                    />
                </div>
                <Toaster closeButton
                    toastOptions={{
                        classNames: {
                            toast: "glass !bg-primary/10 !border-primary/50",
                            closeButton: "!border-[2px] !text-primary !border-primary/50",
                        }
                    }}
                />
            </body>
        </html>
    );
}
