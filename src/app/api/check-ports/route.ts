import { NextResponse } from "next/server";
import net from "net";
import { URL } from "url";

export const dynamic = "force-dynamic"; // Ensure dynamic route behavior

interface PortStatus {
    port: number;
    status: "open" | "closed" | "filtered";
    service?: string;
}

const commonPorts: Record<number, string> = {
    20: "FTP (Data)",
    21: "FTP (Control)",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    465: "SMTPS",
    587: "SMTP (Submission)",
    993: "IMAPS",
    995: "POP3S",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    8080: "HTTP Alt",
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const ports = searchParams.get("ports");

    if (!url || !ports) {
        return NextResponse.json(
            { ports: [], error: "URL and ports are required" },
            { status: 400 }
        );
    }

    try {
        const parsedUrl = new URL(
            url.startsWith("http") ? url : `https://${url}`
        );
        const hostname = parsedUrl.hostname;
        const portNumbers = ports
            .split(",")
            .map((p) => parseInt(p.trim()))
            .filter((p) => !isNaN(p));

        const portChecks: Promise<PortStatus>[] = portNumbers.map((port) => {
            return new Promise((resolve) => {
                const socket = new net.Socket();
                const timeout = 2000; // 2 seconds timeout per port

                socket.setTimeout(timeout);

                socket.on("connect", () => {
                    socket.destroy();
                    resolve({
                        port,
                        status: "open",
                        service: commonPorts[port] || "Unknown",
                    });
                });

                socket.on("timeout", () => {
                    socket.destroy();
                    resolve({
                        port,
                        status: "filtered",
                        service: commonPorts[port] || "Unknown",
                    });
                });

                socket.on("error", () => {
                    socket.destroy();
                    resolve({
                        port,
                        status: "closed",
                        service: commonPorts[port] || "Unknown",
                    });
                });

                socket.connect(port, hostname);
            });
        });

        const results = await Promise.all(portChecks);
        return NextResponse.json({ ports: results });
    } catch (err) {
        console.error("Error checking ports:", err);
        return NextResponse.json(
            { ports: [], error: "Failed to check ports" },
            { status: 500 }
        );
    }
}
