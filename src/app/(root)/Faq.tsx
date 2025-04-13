import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
    return (
        <section id="faq" className="container mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Can&apos;t find what you&apos;re looking for? Contact our
                    support team.
                </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
                <Accordion type="single" collapsible>
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
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-white/80 hover:text-primary">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[16px] text-white/80">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default Faq;
