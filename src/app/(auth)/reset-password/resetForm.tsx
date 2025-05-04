'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiError } from "react-icons/bi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const resetPassFormSchema = z
    .object({
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

type resetPassFormSchemaT = z.infer<typeof resetPassFormSchema>;

const ResetForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<resetPassFormSchemaT>({
        resolver: zodResolver(resetPassFormSchema),
    });

    const router = useRouter();

    const resetPassHandler: SubmitHandler<resetPassFormSchemaT> = async (
        formData: resetPassFormSchemaT
    ) => {
        console.log("Form Data: ", formData, window.location.search.split("=")[1]);
        console.log(formData);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: formData.password,
                token: window.location.search.split("=")[1],
            }),
        });
        const data = await res.json();
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success(
                "Password reset successfully. You can now sign in.",
                {
                    action: {
                        label: "Sign In",
                        onClick: () => {
                            router.push("/signin");
                        }
                    },
                }
            );
            reset();
        }
    };

    return (
        <form className="flex flex-col gap-2"
            onSubmit={handleSubmit(resetPassHandler)}
        >
            <div className="flex flex-col gap-1">
                <Input
                    placeholder="New Password"
                    type="password"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="flex gap-1 items-center text-red-400 text-xs mt-[-4px]">
                        <BiError className="text-sm" />{" "}
                        <span>{errors.password.message}</span>
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="flex gap-1 items-center text-red-400 text-xs mt-[-4px]">
                        <BiError className="text-sm" />{" "}
                        <span>{errors.confirmPassword.message}</span>
                    </p>
                )}
            </div>
            <Button className="w-full mt-1" type="submit"
                disabled={isSubmitting}
            >
                Reset Password
            </Button>
        </form>
    );
};

export default ResetForm;
