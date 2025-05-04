"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FiChevronRight, FiLock, FiMail } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiError } from "react-icons/bi";
import { z } from "zod";
import { toast } from "sonner";

const signupFormSchema = z
    .object({
        firstName: z
            .string()
            .min(3, "First name is required")
            .refine(
                (val) => !val.includes(" "),
                "First name should not contain spaces"
            ),
        lastName: z
            .string()
            .min(3, "Last name is required")
            .refine(
                (val) => !val.includes(" "),
                "Last name should not contain spaces"
            ),
        email: z
            .string()
            .min(1, "email is required")
            .email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password and Confirm do not match",
        path: ["confirmPassword"],
    });

type signUpSchemaType = z.infer<typeof signupFormSchema>;

const SignUpForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<signUpSchemaType>({
        resolver: zodResolver(signupFormSchema),
    });

    const signupHandler: SubmitHandler<signUpSchemaType> = async (
        formData: signUpSchemaType
    ) => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success(
                "Account created successfully! Please check your email for verification link."
            );
            reset();
        }
    };

    return (
        <form onSubmit={handleSubmit(signupHandler)} className="space-y-3">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                    Display Name
                </Label>
                <div>
                    <div className="flex gap-2">
                        <Input
                            id="first-name"
                            placeholder="First Name"
                            {...register("firstName")}
                        />
                        <Input
                            id="last-name"
                            placeholder="Last Name"
                            {...register("lastName")}
                        />
                    </div>
                    {(errors.firstName || errors.lastName) && (
                        <p className="flex gap-1 items-center text-red-400 text-xs mt-1">
                            <BiError className="text-sm" />{" "}
                            <span>
                                {errors.firstName?.message ||
                                    errors.lastName?.message}
                            </span>
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                    Email
                </Label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-[17px] text-gray-500" />
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
            <div>
                <div className="flex gap-2">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">
                            Password
                        </Label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-[17px] text-gray-500" />
                            <Input
                                id="password"
                                placeholder="password"
                                className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                                {...register("password")}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-[17px] text-gray-500" />
                            <Input
                                id="confirm-password"
                                placeholder="password"
                                className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                                {...register("confirmPassword")}
                            />
                        </div>
                    </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                    <p className="flex gap-1 items-center text-red-400 text-xs mt-1">
                        <BiError className="text-sm" />{" "}
                        <span>
                            {errors.password?.message ||
                                errors.confirmPassword?.message}
                        </span>
                    </p>
                )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Signing up..." : "Sign Up"}
                {!isSubmitting && <FiChevronRight className="ml-2" />}
            </Button>
        </form>
    );
};

export default SignUpForm;
