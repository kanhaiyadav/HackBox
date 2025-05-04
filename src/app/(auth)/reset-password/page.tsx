import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ResetForm from "./resetForm";

export const metadata = {
    title: "Sign in",
    description: "Sign in to your HackBox account",
    keywords: ["hackbox", "signin", "login"],
};

const ResetPasswordPage = () => {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Reset Your Password
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Fill in the form below to reset your password.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ResetForm />
            </CardContent>
            
            
            <CardFooter className="flex justify-center border-t border-accent py-6 mx-6">
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

export default ResetPasswordPage;
