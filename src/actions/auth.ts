"use server";

import { auth, signIn, signOut } from "@/auth";
import client from "@/db/db";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/auth";

export async function getSession() {
    const session = await auth();
    return session;
}

export async function signOutAction() {
    await signOut();
}

export async function signInWithCredentials(data: {
    user: {
        name: string;
        email: string;
        image: string;
        emailVerified: Date | null;
    };
}) {
    console.log("signInWithCredentials data", data);
    return await signIn("credentials", {
        user: JSON.stringify(data.user),
        redirect: true,
        redirectTo: "/home",
    });
}

export async function createSession(data: {
    userId?: string;
    expires?: string;
}) {
    if (!data.userId || !data.expires) {
        return null;
    }
    try {
        const user = await client
            .db()
            .collection("users")
            .findOne({
                _id: data.userId ? new ObjectId(data.userId) : undefined,
            });
        if (user) {
            return null;
        }
        return await client
            .db()
            .collection("sessions")
            .insertOne({
                sessionToken: uuidv4(),
                userId: data.userId,
                expires: new Date(data.expires),
            });
    } catch (error) {
        console.error("error in creating session:", error);
        throw error;
    }
}

export async function deleteSession(userId: string) {
    try {
        return await client.db().collection("sessions").deleteOne({
            userId: userId,
        });
    } catch (error) {
        console.error("error in deleting session:", error);
        throw error;
    }
}

export async function sendMagicLink(formData: FormData) {
    const email = formData.get("email")?.toString() || "";

    if (!email || !email.includes("@")) {
        return { error: "Valid email is required" };
    }

    try {
        await signIn("nodemailer", {
            email: email,
            redirect: false,
        });

        // Return success so the client can handle it
        return {
            error: false,
        };
    } catch (error) {
        console.error("Error sending magic link:", error);
        return {
            error: "Failed to send magic link, try again later",
        };
    }
}

export async function sendResetPasswordLink(formData: FormData) { 
    const email = formData.get("email")?.toString() || "";

    if (!email) {
        return { error: "Email is required" };
    }

    try {
        const user = await client.db().collection("users").findOne({ email });
        if (!user) {
            return {
                error: "User not found",
                data: {
                    action: {
                        label: "Sign Up",
                        url: "/signup",
                    },
                }
             };
        };
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
        );
        const resetLink = `${process.env.NEXT_PUBLIC_FE_URL}/reset-password?token=${token}`;
        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="en" style="margin: 0; padding: 0;">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password - Hackbox</title>
            </head>
            
            <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Arial', sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0"
                                style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background-color: #26cbaf; padding: 20px; text-align: center;">
                                        <h1 style="color: #000000; margin: 0; font-size: 28px;">Hackbox</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 40px; text-align: center;">
                                        <h2 style="color: #333333;">Reset Your Password</h2>
                                        <p style="color: #555555;">Click the button below to reset your password.</p>
                                        <a href="${resetLink}" style="display:inline-block; background-color:#26cbaf; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:5px;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`;
        await sendEmail(
            email,
            "Reset Password",
            emailTemplate,
        );

        return {
            error: null,
        };

    } catch (error) {
        console.error("Error sending reset password link:", error);
        return {
            error: "Failed to send reset password link",
            details: error instanceof Error ? error.message : String(error),
        };
    }
}
