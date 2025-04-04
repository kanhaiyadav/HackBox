// app/api/fetch-file/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, fileType } = body;

        if (!url) {
            return NextResponse.json(
                { message: "URL is required" },
                { status: 400 }
            );
        }

        // Normalize the URL
        let baseUrl = url.trim();
        if (!baseUrl.startsWith("http")) {
            baseUrl = "https://" + baseUrl;
        }

        // Remove trailing slash if present
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1);
        }

        // Determine the file path
        const filePath = fileType === "robots" ? "/robots.txt" : "/sitemap.xml";
        const fullUrl = baseUrl + filePath;

        // Fetch the content
        const response = await fetch(fullUrl);

        if (!response.ok) {
            return NextResponse.json(
                {
                    message: `Could not fetch ${filePath}. Status: ${response.status} ${response.statusText}`,
                },
                { status: 404 }
            );
        }

        const content = await response.text();

        return NextResponse.json({ content }, { status: 200 });
    } catch (error) {
        console.error("Error fetching file:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "An error occurred while fetching the file",
            },
            { status: 500 }
        );
    }
}
