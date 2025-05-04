import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./db/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";

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
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                // Log the original URL for debugging
                console.log("Original magic link URL:", url);

                // Parse the URL to make sure we have the correct callback
                const parsedUrl = new URL(url);
                const params = new URLSearchParams(parsedUrl.search);

                // Get the current callbackUrl or default to /home
                let callbackUrl =
                    params.get("callbackUrl") ||
                    `${process.env.NEXT_PUBLIC_FE_URL}/home`;

                // If it's going to /forgot-password, override it
                if (callbackUrl.includes("/forgot-password")) {
                    callbackUrl = `${process.env.NEXT_PUBLIC_FE_URL}/home`;
                    // Update the URL params
                    params.set("callbackUrl", callbackUrl);
                    parsedUrl.search = params.toString();
                    url = parsedUrl.toString();
                }

                console.log("Modified magic link URL:", url);
                console.log("Final callbackUrl:", callbackUrl);

                // Email content
                const { host } = new URL(url);
                const escapedHost = host.replace(/\./g, "&#8203;.");

                const email = {
                    to: identifier,
                    from: provider.from,
                    subject: `Sign in to ${host}`,
                    text: `Sign in to ${host}\n${url}\n\n`,
                    html: `
                        <body>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
                                        <strong>Sign in to ${escapedHost}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                                                    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">Sign in</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
                                        If you did not request this email you can safely ignore it.
                                    </td>
                                </tr>
                            </table>
                        </body>
                    `,
                };

                try {
                    const { createTransport } = await import("nodemailer");
                    const transporter = createTransport(provider.server);
                    await transporter.sendMail(email);
                } catch (error) {
                    console.error("SEND_VERIFICATION_EMAIL_ERROR", error);
                    throw new Error("SEND_VERIFICATION_EMAIL_ERROR");
                }
            },
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
                //@ts-expect-error - credentials.user is not defined in the type but is used in our custom implementation
                if (!credentials?.user) {
                    console.error("No user data provided");
                    return null;
                }

                try {
                    //@ts-expect-error - credentials.user is not defined in the type but is used in our custom implementation
                    const userData = JSON.parse(credentials.user);
                    return userData;
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    return null;
                }
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
                if ("emailVerified" in user) {
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
                    session.user.emailVerified =
                        token.emailVerified instanceof Date
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
