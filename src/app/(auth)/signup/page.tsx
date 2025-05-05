import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FiTwitter } from "react-icons/fi";
import SignUpForm from "./signupForm";
import GoogleBtton from "../GoogleButton";
import GithubBtton from "../GithubBtton";
import { auth } from "@/auth";
import AlredySignedIn from "@/components/alredySignedIn";

export const metadata = {
    title: "Sign up",
    description: "Create a new HackBox account",
    keywords: ["hackbox", "signup", "register"],
};

const SignInPage = async () => {

    const session = await auth();
    if (session?.user) {
        return <AlredySignedIn />;
    }
    
    return (
        <Card className="bg-transparent shadow-none border-none pb-0">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Create your HackBox account
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Enter your details below to create a new account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <SignUpForm />

                <div className="relative my-6 flex items-center gap-2">
                    <hr className="bg-gray-700 grow border-1 border-accent" />
                    <span className="px-2 text-sm text-gray-400">
                        Or continue with
                    </span>
                    <hr className="bg-gray-700 border-1 grow border-accent" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <GoogleBtton />
                    <GithubBtton />
                    <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-700 text-gray-300"
                    >
                        <FiTwitter className="mr-2 h-4 w-4" />
                        Twitter
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-accent py-6 mx-6">
                <p className="text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signin"
                        className="text-primary hover:text-cyan-300 font-medium"
                    >
                        Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default SignInPage;
