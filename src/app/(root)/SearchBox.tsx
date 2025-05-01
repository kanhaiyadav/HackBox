import React, { useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface Faq {
    question: string;
    answer: string;
    category: string;
}

const SearchBox = ({
    category,
    setCategory,
    questions,
    setQuestions,
}: {
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    questions: Faq[];
    setQuestions: React.Dispatch<React.SetStateAction<Faq[]>>;
}) => {
    const initialCategoryRef = useRef(category);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm === "") {
            console.log("Search term is empty");
            setCategory(initialCategoryRef.current);
        } else {
            console.log("Search term is not empty", searchTerm);
            setCategory("");
            console.log("All questions:", questions);
            const filteredQuestions = questions.filter((question) =>
                question.question.toLowerCase().includes(searchTerm)
            );
            console.log("Filtered questions:", filteredQuestions);
            setQuestions(filteredQuestions);
        }
    };

    return (
        <form
            className="w-full max-w-3xl mx-auto flex bg-accent p-4 rounded-md shadow-input"
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Search FAQ"
        >
            <input
                className="bg-transparent flex-1 h-full text-lg outline-none border-none"
                type="text"
                placeholder="Search your question..."
                onChange={handleSearch}
            />
            <FaMagnifyingGlass />
        </form>
    );
};

export default SearchBox;
