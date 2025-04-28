import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client from "@/db/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        console.error("Token is missing in the request.");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FE_URL}/auth-error?code=400&title=Missing Token&description=The token is required to verify your email.&suggestion=Please check the verification link in your email.&btntext=Resend Verification Email&btnlink=/verify-email`);
    }

    console.log("Token received:", token);
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_FE_URL}/auth-error?code=401&title=Invalid Token&description=The token provided is invalid or expired.&suggestion=Please request a new verification email.&btntext=Request New Email&btnlink=/verify-email`
        );
    }

    if (!decoded) {
        console.error("Token verification failed.");
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_FE_URL}/auth-error?code=401&title=Invalid Token&description=The token provided is invalid or expired.&suggestion=Please request a new verification email.&btntext=Request New Email&btnlink=/verify-email`
        );
    }

    const { email } = decoded as { email: string };

    //find the user in the database and update their emailVerified field
    const user = await client.db().collection("users").findOne({ email });

    if (!user) {
        console.error("User not found in the database.");
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_FE_URL}/auth-error?code=404&title=User Not Found&description=The user associated with this email was not found.&suggestion=Please check the email address or register again.&btntext=Register&btnlink=/register`
        );
    }

    if (user.emailVerified) {
        console.log("Email already verified.");
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_FE_URL}/auth-error?code=400&title=Email Already Verified&description=This email has already been verified.&suggestion=You can sign in with this email.&btntext=Sign In&btnlink=/signin`
        );
    }

    await client
        .db()
        .collection("users")
        .updateOne({ email }, { $set: { emailVerified: new Date() } });

    console.log("Email verified successfully for user:", email);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FE_URL}/signin?emailVerified=true`);
}
