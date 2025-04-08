import { NextRequest, NextResponse } from "next/server";
import { Tool } from "@/db/models/tools";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json(
                { message: "Tool name is required" },
                { status: 400 }
            );
        }

        const tool = await Tool.findOne({ slug: slug })
        
        if (!tool) {
            return NextResponse.json(
                { message: "Tool not found" },
                { status: 404 }
            );
        }

        const metadata = {
            title: tool.name,
            description: tool.description,
            icons: {
                icon: `/tools/${tool.categorySlug}/${tool.slug}.png`,
                shortcut: `/tools/${tool.categorySlug}/${tool.slug}.png`,
            },
        };

        return NextResponse.json(metadata, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching tool metadata:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "An error occurred while fetching the tool metadata",
            }, 
            {
                status: 500
            }
        );
    }
}