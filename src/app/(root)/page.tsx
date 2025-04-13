import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    FiCode,
    FiMail,
    FiGithub,
    FiTwitter,
} from "react-icons/fi";
import Hero from "./Hero";
import Features from "./Features";
import Tools from "./Tools";

export default function LandingPage() {
    
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Full-stack Developer",
            quote: "HackBox has saved me countless hours with its comprehensive toolset. The JSON formatter alone is worth it!",
        },
        {
            name: "Michael Chen",
            role: "DevOps Engineer",
            quote: "I use HackBox daily for quick conversions and validations. It's become an essential part of my workflow.",
        },
        {
            name: "Emma Rodriguez",
            role: "UX Designer",
            quote: "The clean interface and powerful tools make HackBox my go-to resource for quick design and development tasks.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2d2d2d] to-[#232323] text-white">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                        <FiCode className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">HackBox</span>
                </div>
                <div className="hidden md:flex space-x-6 items-center">
                    <a
                        href="#features"
                        className="hover:text-primary transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="#tools"
                        className="hover:text-primary transition-colors"
                    >
                        Tools
                    </a>
                    <a
                        href="#testimonials"
                        className="hover:text-primary transition-colors"
                    >
                        Testimonials
                    </a>
                    <a
                        href="#faq"
                        className="hover:text-primary transition-colors"
                    >
                        FAQ
                    </a>
                    <Button variant="outline">Login</Button>
                    <Button>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <Features />

            {/* Tools Section */}
            <Tools />

            {/* Testimonials */}
            <section id="testimonials" className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        What Developers Say
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Trusted by thousands of developers and tech
                        professionals worldwide.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-gray-700">
                            <CardContent className="p-6">
                                <div className="mb-4 text-muted-foreground">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="text-yellow-400"
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="mb-6 italic">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div>
                                    <p className="font-medium">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-16 text-center border border-gray-700">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Boost Your Productivity?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Join thousands of developers who already supercharge
                        their workflow with HackBox.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                        <Button size="lg" className="w-full sm:w-auto">
                            Get Started for Free
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Can&apos;t find what you&apos;re looking for? Contact
                        our support team.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        {
                            question: "Is HackBox free to use?",
                            answer: "Yes! HackBox is completely free to use with all features available. We may offer premium plans in the future with additional capabilities.",
                        },
                        {
                            question: "Do I need to create an account?",
                            answer: "No account is required to use most tools. Some features like saving preferences may require signing in.",
                        },
                        {
                            question: "How often are new tools added?",
                            answer: "We add new tools every month based on user requests and our roadmap. You can suggest tools through our feedback form.",
                        },
                        {
                            question: "Is my data secure?",
                            answer: "Absolutely. All processing happens in your browser. We don't store your data on our servers unless you explicitly choose to save something.",
                        },
                    ].map((item, index) => (
                        <Card key={index} className="border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {item.question}
                                </CardTitle>
                                <CardDescription>{item.answer}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                                    <FiCode className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold">
                                    HackBox
                                </span>
                            </div>
                            <p className="text-muted-foreground max-w-xs">
                                The ultimate collection of developer tools to
                                streamline your workflow.
                            </p>
                            <div className="flex space-x-4 mt-6">
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <FiGithub className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <FiTwitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Development
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Text
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Productivity
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Calculators
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Subscribe</h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Get the latest updates and new tools directly to
                                your inbox.
                            </p>
                            <div className="flex space-x-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-800 border-gray-700"
                                />
                                <Button variant="outline">
                                    <FiMail className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
                        <p>© 2023 HackBox. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary transition-colors"
                            >
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
