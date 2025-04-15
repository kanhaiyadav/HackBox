import React from "react";
import { toolCategories } from "../../../constants/tool";

const Tools = () => {
    return (
        <section
            id="tools"
            className="container mx-auto px-6 py-20 foreground rounded-3xl my-10 px-[100px]"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 font-josefin">
                    Explore Our Tool Categories
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Organized by category for easy discovery. New tools added
                    regularly.
                </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolCategories.map((category, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 bg-accent p-4 rounded-lg shadow-input"
                    >
                        <div className="p-2 rounded-sm bg-primary/20">
                            <category.icon className="text-primary" />
                        </div>
                        <span className="text-lg font-bold">
                            {category.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Tools;
