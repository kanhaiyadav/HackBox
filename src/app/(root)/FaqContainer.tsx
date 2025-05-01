"use client";

import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import SearchBox from "./SearchBox";

interface Faq {
    question: string;
    answer: string;
    category: string;
}

const allQuestions:Array<Faq> = [
    {
        question: "Is HackBox free to use?",
        answer: "Yes! HackBox is completely free to use with all features available. We may offer premium plans in the future with additional capabilities.",
        category: "Do i need?",
    },
    {
        question: "Do I need to create an account?",
        answer: "No account is required to use most tools. Some features like saving preferences may require signing in.",
        category: "Do i need?",
    },
    {
        question: "How often are new tools added?",
        answer: "We add new tools every month based on user requests and our roadmap. You can suggest tools through our feedback form.",
        category: "What is?",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All processing happens in your browser. We don't store your data on our servers unless you explicitly choose to save something.",
        category: "Do i need?",
    },
    {
        question: "What is HackBox?",
        answer: "HackBox is a web application that offers a wide range of small, useful tools including text processors, calculators, and fun utilities like decision makers and random name pickers.",
        category: "What is?",
    },
    {
        question: "What is the purpose of HackBox?",
        answer: "The purpose of HackBox is to provide a one-stop platform for quick, browser-based tools to solve everyday tasks efficiently.",
        category: "What is?",
    },
    {
        question: "What kind of tools are available in HackBox?",
        answer: "HackBox includes text processing tools, math calculators, unit converters, generators, and fun tools like spinners, dice rollers, and random pickers.",
        category: "What is?",
    },
    {
        question: "How to use a text processing tool in HackBox?",
        answer: "Simply select the desired tool from the list, input your text, and get instant results or transformations based on the tool's function.",
        category: "How to?",
    },
    {
        question: "How to find a specific tool in HackBox?",
        answer: "Use the search bar or filter tools by category to quickly find what you need.",
        category: "How to?",
    },
    {
        question: "How to save my results from a HackBox tool?",
        answer: "Most tools offer a 'Copy' or 'Download' button to help you save results directly to your clipboard or as a file.",
        category: "How to?",
    },
    {
        question: "Do I need to create an account to use HackBox?",
        answer: "No, you can access and use all tools on HackBox without creating an account.",
        category: "Do i need?",
    },
    {
        question: "Do I need internet access to use HackBox?",
        answer: "Yes, HackBox is a web-based platform and requires an internet connection to load and use the tools.",
        category: "Do i need?",
    },
    {
        question: "What is the random name picker tool used for?",
        answer: "The random name picker helps you choose a name from a list at random, perfect for giveaways, team assignments, or games.",
        category: "What is?",
    },
    {
        question: "What is the decision maker tool?",
        answer: "It's a fun tool that helps you make simple decisions when you're unsure — just enter options and let it pick for you.",
        category: "What is?",
    },
    {
        question: "How to use the calculator tools in HackBox?",
        answer: "Click on a calculator tool, input your numbers and operations, and results will be calculated instantly.",
        category: "How to?",
    },
    {
        question: "How to suggest a new tool for HackBox?",
        answer: "You can contact the developer via the 'Suggest a Tool' form usually found in the footer or feedback section.",
        category: "How to?",
    },
    {
        question: "Do I need to download anything to use HackBox?",
        answer: "No downloads are needed — HackBox works entirely in your web browser.",
        category: "Do i need?",
    },
    {
        question: "Do I need to pay to use HackBox?",
        answer: "HackBox is completely free to use with no hidden charges.",
        category: "Do i need?",
    },
    {
        question: "What is the text case converter tool?",
        answer: "It converts your input text into various cases like uppercase, lowercase, title case, sentence case, etc.",
        category: "What is?",
    },
    {
        question: "How to use the random number generator?",
        answer: "Enter a minimum and maximum value, then click generate to get a random number in that range.",
        category: "How to?",
    },
    {
        question: "How to share a tool from HackBox?",
        answer: "You can copy the URL from your browser and send it to anyone — each tool has a unique link.",
        category: "How to?",
    },
    {
        question: "Do I need to install HackBox on my phone?",
        answer: "No installation is required, but you can add it to your home screen for quick access.",
        category: "Do i need?",
    },
    {
        question: "What is the lorem ipsum generator used for?",
        answer: "It generates placeholder text for designers, developers, and writers.",
        category: "What is?",
    },
    {
        question:
            "What is the difference between the fun tools and the utility tools in HackBox?",
        answer: "Utility tools are designed to solve practical problems, while fun tools offer entertainment or decision support.",
        category: "What is?",
    },
    {
        question: "How to use the unit converter tool?",
        answer: "Select the category (length, weight, etc.), input a value, and see the equivalent in various units.",
        category: "How to?",
    },
    {
        question: "Do I need technical knowledge to use HackBox tools?",
        answer: "Not at all — the tools are designed to be user-friendly and self-explanatory.",
        category: "Do i need?",
    },
    {
        question: "How to switch between light and dark mode in HackBox?",
        answer: "Click the theme toggle icon on the top right corner of the page.",
        category: "How to?",
    },
    {
        question: "Do I need to update HackBox manually?",
        answer: "No, since it's a web app, you always access the latest version automatically.",
        category: "Do i need?",
    },
    {
        question: "What is planned for future HackBox updates?",
        answer: "Future updates will include more tools, better categorization, user personalization, and performance improvements.",
        category: "What is?",
    },
];

const CategoryCard = ({value,  category, setCategory }: {
    value: string;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div
            className={`bg-primary/10 px-4 py-3 rounded-md flex-1 flex items-center justify-center gap-4 hover:outline-2 hover:outline-primary/80 hover:bg-primary/20 transition-colors cursor-default ${category === value ? "bg-primary/20" : ""} shadow-input`}
            onClick={() => setCategory(value)}
        >
            {
                category === value ? (
                    <FaMinus className="text-primary text-2xl" />
                ) : (
                    <FaPlus className="text-primary text-2xl" />
                )
            }
            <span className="text-primary font-bold text-3xl whitespace-nowrap">
                {value}
            </span>
        </div>
    );
};

const FaqContainer = () => {
    const [category, setCategory] = useState("Do i need?");
    const [questions, setQuestions] = useState<Array<Faq>>([]);
    const [size, setSize] = useState(5);

    console.log("Category:", category);
    console.log("Questions:", questions);

    useEffect(() => { 
        if (category === "") {
            return;
        }
        const selectQuestions = allQuestions.filter((faq) => faq.category === category);
        setQuestions(selectQuestions);
    }, [category]);

    return (
        <div className="max-w-3xl mx-auto">
            <SearchBox category={category} setCategory={setCategory} questions={allQuestions} setQuestions={setQuestions} />
            <div className="flex justify-between items-center my-4 gap-6">
                <CategoryCard value="Do i need?" category={category} setCategory={setCategory} />
                <CategoryCard value="What is?" category={category} setCategory={setCategory} />
                <CategoryCard value="How to?" category={category} setCategory={setCategory} />
            </div>
            <div className="w-full space-y-4">
                <Accordion
                    type="single"
                    collapsible
                    className="rounded-md overflow-hidden"
                >
                    {questions.slice(0, size).map((item, index) => (
                        <AccordionItem
                            value={`item-${index}`}
                            key={index}
                            className="px-4 hover:bg-primary/5"
                        >
                            <AccordionTrigger className="text-lg text-white/80 hover:text-primary">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[16px] text-white/80">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <Button
                variant="outline"
                className="w-full mt-4 mb-8"
                onClick={() => {
                    if (size === questions.length) {
                        setSize(5);
                    } else {
                        setSize(questions.length);
                    }
                }}
            >
                {size === questions.length ? (
                    <span>Show Less</span>
                ) : (
                    <span>Show All</span>
                )}
            </Button>
        </div>
    );
};

export default FaqContainer;
