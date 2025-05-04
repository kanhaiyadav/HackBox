import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client from "@/db/db";
import { hashPassword } from "@/utils/auth";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
    const { password, token } = await request.json();
    if (!password || !token) {
        return NextResponse.json(
            { error: "Password and token are required!" },
            { status: 400 }
        );
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            return NextResponse.json(
                { error: "Invalid or expired token!" },
                { status: 400 }
            );
        }

        const user = await client
            .db()
            .collection("password-reset-tokens")
            .findOne({
                userId: new ObjectId(decoded.id as string),
                token: token,
            });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update the user's password in the database
        const { hash, salt } = await hashPassword(password);
        await client
            .db()
            .collection("users")
            .updateOne(
                { _id: new ObjectId(decoded.id as string) },
                {
                    $set: {
                        passwordHash: hash,
                        passwordSalt: salt,
                    },
                }
            );

        // Delete the token from the database
        await client
            .db()
            .collection("password-reset-tokens")
            .deleteOne({ userId: new ObjectId(decoded.id as string), token: token });

        return NextResponse.json({ error: null });
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: "Invalid or expired token!" },
                { status: 400 }
            );
        } else if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json(
                { error: "Token has expired!" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
