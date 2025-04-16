import Hero from "./Hero";
import Features from "./Features";
import Tools from "./Tools";
import Faq from "./Faq";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import CTA from "./CTA";
import Nav from "./Nav";
import { Borel, Comic_Neue, Josefin_Sans, Space_Grotesk } from "next/font/google";

const borel = Borel({
    subsets: ["latin"],
    weight: ["400"], 
    variable: "--font-borel",
    display: "swap",
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-josefin",
    display: "swap",
});

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-comic",
    display: "swap",
});

const space = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-space",
    display: "swap",
});

export default function LandingPage() {
    return (
        <div className={`min-h-screen bg-background text-white  ${borel.variable} ${josefin.variable} ${comic.variable} ${space.variable}`}>
            {/* Navigation */}
            <Nav />

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <Features />

            {/* Tools Section */}
            <Tools />

            {/* Testimonials */}
            <Testimonials />

            {/* CTA Section */}
            <CTA />
           
            {/* FAQ Section */}
            <Faq />

            {/* Footer */}
            <Footer />
           
        </div>
    );
}
