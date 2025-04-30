"use server";

import { auth, signIn, signOut } from "@/auth";
import client from "@/db/db";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

export async function getSession() {
    const session = await auth();
    return session;
}

export async function signOutAction() {
    await signOut();
}

export async function signInWithCredentials(data: {
    email: string;
    password: string;
}) {
    try {
        
        return await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true,
            redirectTo: "/home",
        });
    } catch (error) {
        console.error("error in signing in:");
        return {
            error: "Invalid email or password",
        }
    }
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
