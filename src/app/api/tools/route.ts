import { Tool } from "@/db/models/tools";
import { connectToMongoDB } from "@/db";

export const dynamic = "force-static";

export const POST = async (request: Request) => {
    try {
        await connectToMongoDB();
        const toolData = await request.json();
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
    try {
        await connectToMongoDB();
        const tools = await Tool.find();
        return new Response(JSON.stringify(tools), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    }catch(error: unknown){
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
