import crypto from "crypto";
import { transporter } from "@/services/email";

/**
 * Hashes a password with a random salt using PBKDF2
 * @param {string} password - The password to hash
 * @returns {Promise<{hash: string, salt: string}>} - Object containing the hash and salt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string; }> {
    // Generate a cryptographically strong random salt
    const salt = crypto.randomBytes(16).toString("hex");

    return new Promise((resolve, reject) => {
        // Use PBKDF2 with SHA-512, 100,000 iterations, 64 bytes output
        crypto.pbkdf2(
            password,
            salt,
            100000,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) reject(err);

                resolve({
                    hash: derivedKey.toString("hex"),
                    salt: salt,
                });
            }
        );
    });
}

/**
 * Verifies a password against a stored hash and salt
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The stored salt
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(
    password: string,
    hash: string,
    salt: string
) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            salt,
            100000,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) reject(err);

                // Timing-safe comparison to prevent timing attacks
                try {
                    resolve(
                        crypto.timingSafeEqual(
                            Buffer.from(hash, "hex"),
                            derivedKey
                        )
                    );
                } catch (error) {
                    console.error("Error comparing hashes:", error);
                    // If buffers are different lengths or other errors
                    resolve(false);
                }
            }
        );
    });
}

export const sendEmail = async (from: string, to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};