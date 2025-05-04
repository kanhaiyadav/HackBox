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

export default ResetPasswordPage;
