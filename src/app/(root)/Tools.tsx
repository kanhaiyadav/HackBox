'use client';

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { toolCategories } from "../../../constants/tool";

const Tools = () => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // Container variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Delay between each child animation
                delayChildren: 0.2, // Initial delay before starting animations
            },
        },
    };

    // Individual item variants for the pop-up effect
    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    return (
        <section
            id="tools"
            className="w-full py-20 foreground rounded-3xl my-10 px-[20px] sm:px-[50px] md:px-[100px]"
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
            <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                ref={ref}
            >
                {toolCategories.map((category, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center gap-4 bg-accent p-3 sm:p-4 rounded-lg shadow-input"
                        variants={itemVariants}
                    >
                        <div className="p-2 rounded-sm bg-primary/20">
                            <category.icon className="text-primary" />
                        </div>
                        <span className="text-lg font-bold">
                            {category.title}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Tools;
