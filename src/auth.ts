import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./db/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "./utils/auth";

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
                port: process.env.EMAIL_SERVER_PORT
                    ? Number(process.env.EMAIL_SERVER_PORT)
                    : undefined,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "email",
                },
                password: {
                    type: "password",
                    label: "password",
                },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    console.error("*******Email or password not provided");
                    return null;
                }

                const db = await client.db();
                const user = await db.collection("users").findOne({
                    email: credentials.email,
                });

                if (!user) {
                    console.error(
                        "*********User not found:",
                        credentials.email
                    );
                    return null;
                }

                const verify = await verifyPassword(
                    credentials?.password as string,
                    user.passwordHash,
                    user.passwordSalt
                );

                if (!verify) {
                    console.error(
                        "********Password verification failed:",
                        credentials.email
                    );
                    throw new Error("Invalid Credentials");
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || "",
                    image: user.image || "",
                    emailVerified: user.emailVerified || null,
                };
            },
        }),
    ],
    callbacks: {
        // This callback runs before the signin attempt
        async signIn({ user, account }) {
            // For magic link (nodemailer provider), check if user exists first
            if (account?.provider === "nodemailer") {
                try {
                    const db = await client.db();
                    const usersCollection = db.collection("users");

                    // Check if a user with this email exists
                    const existingUser = await usersCollection.findOne({
                        email: user.email,
                    });

                    // Only allow sign in if user exists
                    if (!existingUser) {
                        return false; // This will prevent sign in and redirect to error page
                    }
                } catch (error) {
                    console.error("Error checking user in MongoDB:", error);
                    return false;
                }
            }

            // Allow signin for all other cases
            return true;
        },

        // Add more fields to the token if needed
        async jwt({ token, user, account }) {
            // When a user signs in, add their data to the token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                
                // Check if emailVerified exists on the user object
                if ('emailVerified' in user) {
                    token.emailVerified = user.emailVerified;
                }

                // Optional: track the provider used
                if (account) {
                    token.provider = account.provider;
                }
            }
            return token;
        },

        // Transfer data from token to session
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;

                // Ensure these match the user object from authorize
                if (token.email) session.user.email = token.email as string;
                if (token.name) session.user.name = token.name as string;
                if (token.emailVerified) {
                    session.user.emailVerified = token.emailVerified instanceof Date 
                        ? token.emailVerified 
                        : new Date(token.emailVerified as string);
                }
            }
            return session;
        },
    },
    // This is the key part that was missing
    session: {
        strategy: "jwt", // Using JWT for all providers
        maxAge: 30 * 24 * 60 * 60, // 30 days session
    },
    // Make sure your secret is set in environment variables
    secret: process.env.AUTH_SECRET,
    // Enable debug mode in development
    debug: process.env.NODE_ENV === "development",
});
