"use server";

import { auth, signOut } from "@/auth";

export async function getSession() {
    const session = await auth();
    return session;
}

export async function signOutAction() {
    await signOut();
}