export const getMetadata = async (slug: string) => {
    
    try {
        console.log("Fetching metadata for slug:", slug);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/metadata?slug=${slug}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        return await res.json();
    }
    catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            title: "Error",
            description: "An error occurred while fetching metadata",
            icons: {
                icon: "/favicon.ico",
                shortcut: "/favicon.ico",
            },
        };
    }
}