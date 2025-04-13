import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    FiCode,
    FiLayers,
    FiZap,
    FiShield,
    FiPieChart,
    FiMail,
    FiGithub,
    FiTwitter,
} from "react-icons/fi";

export default function LandingPage() {
    const toolCategories = [
        {
            name: "Development",
            icon: <FiCode className="w-5 h-5" />,
            tools: [
                "JSON Formatter",
                "Base64 Encoder",
                "Regex Tester",
                "SQL Formatter",
                "JWT Debugger",
            ],
        },
        {
            name: "Text",
            icon: <FiLayers className="w-5 h-5" />,
            tools: [
                "Markdown Preview",
                "Text Diff",
                "Lorem Ipsum",
                "Case Converter",
                "Character Counter",
            ],
        },
        {
            name: "Productivity",
            icon: <FiZap className="w-5 h-5" />,
            tools: [
                "URL Shortener",
                "QR Generator",
                "Password Generator",
                "Timer",
                "Meeting Cost Calculator",
            ],
        },
        {
            name: "Calculators",
            icon: <FiPieChart className="w-5 h-5" />,
            tools: [
                "BMI Calculator",
                "Loan Calculator",
                "Currency Converter",
                "Age Calculator",
                "Tip Calculator",
            ],
        },
        {
            name: "Security",
            icon: <FiShield className="w-5 h-5" />,
            tools: [
                "Password Strength",
                "IP Lookup",
                "User Agent Parser",
                "Hash Generator",
                "SSL Checker",
            ],
        },
        {
            name: "Fun",
            icon: <FiZap className="w-5 h-5" />,
            tools: [
                "Meme Generator",
                "Name Combiner",
                "Horoscope",
                "Love Calculator",
                "Bored Button",
            ],
        },
    ];

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
                <div className="hidden md:flex space-x-6">
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
                </div>
                <div className="flex space-x-4">
                    <Button variant="outline">Login</Button>
                    <Button>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <Badge variant="secondary" className="mb-4">
                    50+ TOOLS AT YOUR FINGERTIPS
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Your Ultimate{" "}
                    <span className="text-primary">Developer</span> Toolbox
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                    HackBox is a curated collection of powerful, lightweight
                    tools to supercharge your productivity and development
                    workflow.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <Button size="lg" className="px-8">
                        Start Exploring
                    </Button>
                    <Button size="lg" variant="outline" className="px-8">
                        View All Tools
                    </Button>
                </div>
                <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"></div>
                    <img
                        src="/dashboard.png"
                        alt="HackBox Dashboard"
                        className="relative w-full h-auto"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Why Choose HackBox?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        HackBox brings together all the essential tools you need
                        in one beautifully designed, easy-to-use platform.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border-gray-700 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <FiZap className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Lightning Fast</CardTitle>
                            <CardDescription>
                                All tools load instantly with no unnecessary
                                bloat.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-gray-700 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <FiLayers className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Comprehensive</CardTitle>
                            <CardDescription>
                                50+ carefully selected tools covering all your
                                needs.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-gray-700 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <FiShield className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Privacy Focused</CardTitle>
                            <CardDescription>
                                All processing happens in your browser - no data
                                sent to servers.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Tools Section */}
            <section
                id="tools"
                className="container mx-auto px-6 py-20 bg-gray-900/50 rounded-3xl my-10"
            >
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Explore Our Tool Categories
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Organized by category for easy discovery. New tools
                        added regularly.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toolCategories.map((category, index) => (
                        <Card
                            key={index}
                            className="border-gray-700 hover:border-primary transition-colors"
                        >
                            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    {category.icon}
                                </div>
                                <div>
                                    <CardTitle>{category.name}</CardTitle>
                                    <CardDescription>
                                        {category.tools.length}+ tools
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.tools.map((tool, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                                            {tool}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

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
                                    "{testimonial.quote}"
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
                        Can't find what you're looking for? Contact our support
                        team.
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
