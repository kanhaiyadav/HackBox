import { NextPage } from "next";
import ColorBlindnessSimulator from "./color-blindness-simulator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Color Blindness Simulator",
    description: "Simulate various types of color blindness.",
    openGraph: {
        title: "HackBox | Color Blindness Simulator",
        description: "Simulate various types of color blindness.",
        url: "https://hackbox.kanhaiya.me/tools/color-manipulation/color-blindness-simulator",
        siteName: "HackBox",
        images: [
            {
                url: "https://hackbox.kanhaiya.me/open-graph.jpg",
                width: 1200,
                height: 630,
                alt: "Color Blindness Simulator Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HackBox | Color Blindness Simulator",
        description: "Simulate various types of color blindness.",
        images: ["https://hackbox.kanhaiya.me/open-graph.jpg"],
    },
};

const Home: NextPage = () => {
    return (
        <div className="min-h-screen">
            <main>
                <ColorBlindnessSimulator />
            </main>
        </div>
    );
};

export default Home;
