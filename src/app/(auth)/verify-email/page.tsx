import React from "react";
import VerifyForm from "./VerifyForm";
import { TbMailCheck } from "react-icons/tb";

export const metadata = {
    title: "Verify Email",
    description: "Verify your email address",
    keywords: ["hackbox", "verify-email", "email-verification"],
};

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 w-full mx-auto">
            <div className="bg-accent rounded-full p-4 shadow-input w-fit">
                <TbMailCheck className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl text-primary font-bold mt-[20px]">Verify Your Email</h1>
            <p className="text-sm text-white/60 my-2">Enter your email address below, we will be sending a email to verify that its really you. Note, the verification link in the email will expire in 15 minutes.</p>
            <VerifyForm />
        </div>
    );
};

export default page;
