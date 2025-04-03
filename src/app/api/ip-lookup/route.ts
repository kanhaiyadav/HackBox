// src/app/api/ip-lookup/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
    // Extract the IP from the URL params
    const url = new URL(request.url);
    const ip = url.searchParams.get("ip");

    if (!ip) {
        return NextResponse.json(
            { success: false, error: "IP address is required" },
            { status: 400 }
        );
    }

    try {
        // You should use a paid API service in production for reliable data
        // This example uses a free service with limited requests
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);

        return NextResponse.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("IP lookup error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to lookup IP address" },
            { status: 500 }
        );
    }
}
