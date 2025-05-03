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
