/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import dns from "dns/promises";
import { URL } from "url";

export const dynamic = "force-dynamic"; // Ensure dynamic route behavior

interface ResponseData {
    isUp: boolean;
    statusCode?: number;
    sslValid?: boolean;
    sslExpires?: string;
    serverInfo?: string;
    ipAddress?: string;
    dnsRecords?: any[];
    redirects?: any[];
    error?: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const checkSSL = searchParams.get("checkSSL") === "true";
    const checkDNS = searchParams.get("checkDNS") === "true";
    const checkRedirects = searchParams.get("checkRedirects") === "true";

    if (!url) {
        return NextResponse.json(
            { isUp: false, error: "URL is required" },
            { status: 400 }
        );
    }

    try {
        const parsedUrl = new URL(
            url.startsWith("http") ? url : `https://${url}`
        );
        const result: ResponseData = { isUp: false };

        // Get IP address
        try {
            result.ipAddress = await dns
                .lookup(parsedUrl.hostname)
                .then(({ address }) => address);
        } catch (dnsError) {
            result.ipAddress = "Unknown";
        }

        // Check DNS records if requested
        if (checkDNS) {
            try {
                result.dnsRecords = await dns.resolve(
                    parsedUrl.hostname,
                    "ANY"
                );
            } catch (dnsError) {
                result.dnsRecords = [];
            }
        }

        // Follow redirects if requested
        if (checkRedirects) {
            const redirects: any[] = [];
            let currentUrl = url;
            let response;

            try {
                do {
                    response = await axios.head(currentUrl, {
                        maxRedirects: 0,
                        validateStatus: () => true,
                    });

                    if ([301, 302, 303, 307, 308].includes(response.status)) {
                        const location = response.headers.location;
                        if (location) {
                            redirects.push({
                                url: currentUrl,
                                statusCode: response.status,
                            });
                            currentUrl = new URL(
                                location,
                                currentUrl
                            ).toString();
                        }
                    }
                } while ([301, 302, 303, 307, 308].includes(response.status));

                result.redirects = redirects;
            } catch (err) {
                console.error("Error tracking redirects:", err);
            }
        }

        // Check SSL certificate if requested and it's HTTPS
        if (checkSSL && parsedUrl.protocol === "https:") {
            try {
                const sslInfo = await new Promise<{
                    valid: boolean;
                    expires?: string;
                }>((resolve) => {
                    const req = https.request(
                        parsedUrl,
                        { method: "HEAD" },
                        (res) => {
                            const cert = res.socket.getPeerCertificate();
                            const valid = res.socket.authorized || false;
                            const expires = cert.valid_to
                                ? new Date(cert.valid_to).toISOString()
                                : undefined;
                            resolve({ valid, expires });
                        }
                    );

                    req.on("error", () => resolve({ valid: false }));
                    req.end();
                });

                result.sslValid = sslInfo.valid;
                result.sslExpires = sslInfo.expires;
            } catch (sslError) {
                result.sslValid = false;
            }
        }

        // Final request to get status and server info
        try {
            const response = await axios.get(url, {
                validateStatus: () => true,
                timeout: 10000,
            });

            result.isUp = response.status < 400;
            result.statusCode = response.status;
            result.serverInfo =
                response.headers["server"] ||
                response.headers["x-powered-by"] ||
                "Unknown";
        } catch (err) {
            if (axios.isAxiosError(err)) {
                result.isUp = false;
                result.statusCode = err.response?.status || 500;
                result.serverInfo =
                    err.response?.headers["server"] || "Unknown";
            } else {
                result.isUp = false;
                result.statusCode = 500;
            }
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Error checking website status:", err);
        return NextResponse.json(
            { isUp: false, error: "Failed to check website status" },
            { status: 500 }
        );
    }
}
