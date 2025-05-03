import { NextRequest, NextResponse } from "next/server";
import client from "@/db/db";
import { verifyPassword } from "@/utils/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await client.db().collection("users").findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found",
                    data: {
                        action: {
                            label: "Sign Up",
                            url: "/signup",
                        }
                    }
                },
                { status: 404 }
            );
        }

        const verify = await verifyPassword(
            password,
            user.passwordHash,
            user.passwordSalt
        );

        if (!verify) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (!user.emailVerified) {
            return NextResponse.json(
                {
                    error: "Your email is not verified",
                    data: {
                        action: {
                            label: "Verify Email",
                            url: "/verify-email",
                        }
                    }
                 },
                { status: 403 }
            );
        }

        return NextResponse.json({
            error: null,
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || "",
                    image: user.image || "",
                    emailVerified: user.emailVerified || null,
                }
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in signup:", error);
        return NextResponse.json(
            { error: "An error occurred during signup" },
            { status: 500 }
        );
    }
}
