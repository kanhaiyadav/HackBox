import Hero from "./Hero";
import Features from "./Features";
import Tools from "./Tools";
import Faq from "./Faq";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import CTA from "./CTA";
import Nav from "./Nav";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-white">
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
