import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Head>
                <title>Twitch Stream Checker</title>
                <meta
                    name="description"
                    content="Check if Twitch streamers are online"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4 py-8">{children}</main>

            <footer className="container mx-auto px-4 py-6 border-t border-gray-800 mt-10">
                <p className="text-center text-gray-500 text-sm">
                    Twitch Stream Checker &copy; {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
};

export default Layout;
