'use client';

import React from "react";
import { FiLayers, FiShield, FiZap } from "react-icons/fi";
import { motion, useInView } from "framer-motion";

const cardData = [
    {
        title: "Lightning Fast",
        description: "All tools load instantly with no unnecessary bloat.",
        icon: FiZap,
    },
    {
        title: "Comprehensive",
        description: "50+ carefully selected tools covering all your needs.",
        icon: FiLayers,
    },
    {
        title: "Privacy Focused",
        description:
            "All processing happens in your browser - no data sent to servers.",
        icon: FiShield,
    },
];

const FeatureCard = ({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
}) => {
    // Floating animation variants
    const floatingAnimation = {
        y: [-2, 2],
        transition: {
            y: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
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
        <motion.div
            className="w-full sm:w-[300px] lg:w-fit max-w-[400px] h-fit min-h-[100px] bg-primary/10 border-l-[3.5px] border-primary relative px-[15px] pt-[30px] pb-[15px]"
            variants={itemVariants}
        >
            <motion.div
                className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 z-2"
                animate={floatingAnimation}
            >
                <Icon className="text-primary text-3xl" />
            </motion.div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28.5"
                height="34.5"
                fill="none"
                viewBox="0 0 57 69"
                preserveAspectRatio="none"
                className="absolute top-0 left-[-3px]"
            >
                <path
                    className=" fill-background"
                    d="M54 0V0.716804C54 25.9434 35.0653 47.1517 10 50L0 57V0H54Z"
                ></path>
                <path
                    className=" fill-primary"
                    d="M56.9961 4.15364C57.0809 2.49896 55.8083 1.08879 54.1536 1.00394C52.499 0.919082 51.0888 2.19168 51.0039 3.84636L56.9961 4.15364ZM9.09704 51.7557L8.49716 48.8163L9.09704 51.7557ZM6 69V59.2227H0V69H6ZM9.69692 54.6951L14.3373 53.7481L13.1375 47.8693L8.49716 48.8163L9.69692 54.6951ZM14.3373 53.7481C38.202 48.8777 55.7486 28.4783 56.9961 4.15364L51.0039 3.84636C49.8967 25.4384 34.3213 43.5461 13.1375 47.8693L14.3373 53.7481ZM6 59.2227C6 57.0268 7.54537 55.1342 9.69692 54.6951L8.49716 48.8163C3.55195 49.8255 0 54.1756 0 59.2227H6Z"
                ></path>
            </svg>
            <div className="absolute top-[-3px] left-[-6px] h-[27px] w-[7px] bg-background"/>
            <div>
                <h2 className="text-primary font-bold text-lg lg:text-xl">{title}</h2>
                <p className="text-muted-foreground text-sm lg:text-base">{description}</p>
            </div>
        </motion.div>
    );
};

const Features = () => {

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

    return (
        <section id="features" className="md:my-[150px] mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 font-josefin">
                    Why Choose HackBox?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    HackBox brings together all the essential tools you need in
                    one beautifully designed, easy-to-use platform.
                </p>
            </div>
            <motion.div
                ref={ref}
                className="flex flex-col sm:flex-row flex-wrap items-center gap-8 justify-around"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
            >
                {cardData.map((card, index) => (
                    <FeatureCard
                        key={index}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default Features;
