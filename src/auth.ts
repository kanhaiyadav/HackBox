import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./db/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Nodemailer from "next-auth/providers/nodemailer";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                },
            },
        }),
        GitHub,
        Twitter,
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : undefined,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        // This callback runs before the signin attempt
        // async signIn({ user, account, profile, email, credentials }) {
        async signIn({ user, account }) {
            // For magic link (nodemailer provider), check if user exists first
            if (account?.provider === "nodemailer") {
                // Connect to your MongoDB collection
                const db = (await client).db();
                const usersCollection = db.collection("users");

                // Check if a user with this email exists
                const existingUser = await usersCollection.findOne({
                    email: user.email,
                });

                // Only allow sign in if user exists
                if (!existingUser) {
                    return false; // This will prevent sign in and redirect to error page
                }
            }

            // Allow signin for all other cases
            return true;
        },
    },
});
