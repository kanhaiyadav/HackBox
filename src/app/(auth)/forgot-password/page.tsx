import { Card, CardFooter } from "@/components/ui/card";
import Main from "./main";
import Link from "next/link";

export const metadata = {
    title: "Sign in",
    description: "Sign in to your HackBox account",
    keywords: ["hackbox", "signin", "login"],
};

const SignInPage = () => {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <Main />
            <CardFooter className="flex flex-col justify-center border-t border-accent py-6 mx-6">
                <p className="text-sm text-gray-400">
                    Need Help?
                    <Link
                        href="/signup"
                        className="text-primary hover:text-cyan-300 font-medium"
                    >
                        &nbsp;Contact us
                    </Link>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Your account’s security is our top priority.
                </p>
            </CardFooter>
        </Card>
    );
};

export default SignInPage;
