import { Tool } from "@/db/models/tools";
import { connectToMongoDB } from "@/db";

export const POST = async (request: Request) => {
    try {
        await connectToMongoDB();
        console.log("POST request received");
        const toolData = await request.json();
        console.log("Tool data received", toolData);
        const tool = await Tool.create(toolData);
        return new Response(JSON.stringify(tool), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return new Response(errorMessage, {
            status: 500,
        });
    }
};

export const GET = async () => {
    return new Response("GET request received", {
        status: 200,
    });
};
