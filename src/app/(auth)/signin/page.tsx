import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FiGithub, FiTwitter } from "react-icons/fi";
import SigninForm from "./signinForm";

export const metadata = {
    title: "Sign in",
    description: "Sign in to your HackBox account",
    keywords: ["hackbox", "signin", "login"],
};

const SignInPage = () => {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Sign in to HackBox
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Enter your credentials below to access your account
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    action={async () => {
                        "use server";
                        await signIn("google");
                    }}
                >
                    <button type="submit">Signin with Google</button>
                </form>
                <SigninForm />
                <div className="relative my-6 flex items-center gap-2">
                    <hr className="bg-gray-700 grow border-1 border-accent" />
                    <span className="px-2 text-sm text-gray-400">
                        Or continue with
                    </span>
                    <hr className="bg-gray-700 border-1 grow border-accent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-700 text-gray-300"
                    >
                        <FiGithub className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                    <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-700 text-gray-300"
                    >
                        <FiTwitter className="mr-2 h-4 w-4" />
                        Twitter
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-gray-700 p-6">
                <p className="text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-primary hover:text-cyan-300 font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default SignInPage;
