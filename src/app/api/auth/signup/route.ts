import { NextResponse } from "next/server";
import { hashPassword } from "@/utils/auth";
import client from "@/db/db";
import { User } from "@/types";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utils/auth";
import fs from "fs";
import path from "path";


export async function POST(request: Request) {
    try {
        // 1. Parse and validate request body
        const body = await request.json();
        const { email, firstName, lastName, password } = body;

        // 2. Check if user already exists (pseudocode - implement based on your DB)
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            // Don't reveal if user exists for security
            return NextResponse.json(
                { error: "User already exist" },
                { status: 409 }
            );
        }

        // 3. Hash the password
        const { hash, salt } = await hashPassword(password);

        // 4. Create the user (pseudocode - implement based on your DB)
        await createUser({
            email,
            name: `${firstName} ${lastName}`,
            passwordHash: hash,
            passwordSalt: salt,
            emailVerified: null,
            createdAt: new Date(),
        });

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" } // expires in 15 minutes (can be '1h', '1d' etc)
        );

        const verificationLink = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email?token=${token}`;
        const emailTemplate= `
        <!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email - Hackbox</title>
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
                            <h2 style="color: #333333;">Verify Your Email Address</h2>
                            <p style="color: #555555; font-size: 16px; margin: 20px 0;">Thank you for signing up with
                                Hackbox! <br> Please confirm your email address by clicking the button below:</p>
                            <a href="${verificationLink}"
                                style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #26cbaf; color: #000000; text-decoration: none; border-radius: 6px; font-size: 16px;">Verify
                                Email</a>
                            <p style="color: #999999; font-size: 14px; margin-top: 30px;">If you did not create an
                                account, no further action is required.</p>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color: #f4f4f7; text-align: center; padding: 20px; font-size: 12px; color: #888888;">
                            © 2025 Hackbox. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `;

        await sendEmail(
            process.env.EMAIL_SERVER_USER as string,
            email,
            "Verify your email address",
            emailTemplate
        );
        
        return NextResponse.json(
            {
                error: null,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        // Generic error message to avoid leaking info
        return NextResponse.json(
            { error: "An error occurred during signup" },
            { status: 500 }
        );
    }
}

// These functions would need to be implemented based on your database choice
async function findUserByEmail(email:string) {
    const db = client.db();
    const user = db.collection("users").findOne({ email });
    return user;
}

async function createUser(userData: User) {
    const db = client.db();
    const result = await db.collection("users").insertOne(userData);
    const createdUser = await db.collection("users").findOne({ _id: result.insertedId });
    return createdUser; // Return the created user
}