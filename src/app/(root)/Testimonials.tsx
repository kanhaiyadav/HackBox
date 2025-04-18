"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Card = {
    id: number;
    name: string;
    designation: string;
    quote: string;
    gradient: string;
    avatar: string;
};

const testimonials = [
    { image: "/images/kishore_gunnam.jpg", className: "top-20 right-12" },
    { image: "/images/manu_arora.jpg", className: "top-40 right-32" },
    { image: "/images/person3.png", className: "top-60 right-16" },
    { image: "/images/person4.png", className: "top-80 right-28" },
    { image: "/images/person5.png", className: "top-96 right-20" },
    { image: "/images/person4.png", className: "top-80 right-28" },
    { image: "/images/kishore_gunnam.jpg", className: "top-20 right-12" },
    { image: "/images/manu_arora.jpg", className: "top-40 right-32" },
];

const features = [
    "Completely free and open-source",
    "privacy-focused and secure",
    "lightweight and lightning-fast",
];

const Testimonials = () => {
    const [cards, setCards] = useState<Card[]>([
        {
            id: 1,
            name: "Sarah Johnson",
            designation: "Full-stack Developer",
            quote: "HackBox has saved me countless hours with its comprehensive toolset. The JSON formatter alone is worth it!",
            gradient: "from-[#024f42]",
            avatar: "/images/kishore_gunnam.jpg",
        },
        {
            id: 2,
            name: "Michael Chen",
            designation: "DevOps Engineer",
            quote: "I use HackBox daily for quick conversions and validations. It's become an essential part of my workflow.",
            gradient: "from-[#3b024f]",
            avatar: "/images/manu_arora.jpg",
        },
        {
            id: 3,
            name: "Emma Rodriguez",
            designation: "UX Designer",
            quote: "The clean interface and powerful tools make HackBox my go-to resource for quick design and development tasks.",
            gradient: "from-[#02154f]",
            avatar: "/images/person3.png",
        },
        {
            id: 4,
            name: "Sarah Johnson",
            designation: "Full-stack Developer",
            quote: "HackBox has saved me countless hours with its comprehensive toolset. The JSON formatter alone is worth it!",
            gradient: "from-[#33210a]",
            avatar: "/images/person4.png",
        },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards((prevCards) => {
                const newArray = [...prevCards];
                newArray.unshift(newArray.pop()!);
                return newArray;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="px-[100px]">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 font-josefin">
                    What People Say
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Trusted by thousands of people and professionals
                    worldwide.
                </p>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <div className="relative w-[500px] h-[300px]">
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                className={`absolute w-full h-full rounded-[20px] p-6 text-white bg-gradient-to-br ${card.gradient} to-background shadow-foreground`}
                                style={{
                                    transformOrigin: "top center",
                                }}
                                animate={{
                                    top: index * -10,
                                    scale: 1 - index * 0.06,
                                    zIndex: cards.length - index,
                                }}
                            >
                                <div className="flex flex-col justify-between relative z-10 h-full">
                                    <Image
                                        src={"/quote.svg"}
                                        alt="Quote"
                                        width={40}
                                        height={40}
                                        className="relative left-[-10px]"
                                    />
                                    <p className="tracking-[0.2em] text-lg font-medium font-comic">
                                        {card.quote}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={card.avatar}
                                            alt="Avatar"
                                            width={50}
                                            height={50}
                                            className="rounded-full shadow-input"
                                        />
                                        <div className="mt-auto">
                                            <p className="text-lg opacity-90 font-stylish relative bottom-[-5px]">
                                                {card.name}
                                            </p>
                                            <p className="text-sm text-white/60">
                                                {card.designation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-4">
                        <p className="text-white/80 text-lg max-w-md">
                            Our users are our biggest advocates. They love how
                            easy it is to use our product and how it helps them
                            achieve their goals.
                        </p>

                        <div className="space-y-4 mt-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-white/80">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="relative w-[600px] h-[600px] overflow-hidden">
                    <OrbitingIcons
                        centerIcon={
                            <div className="p-4 overflow-hidden z-20 flex items-center justify-center rounded-[15px] border-[1.5px] border-[#F3F3F3] bg-gradient-to-br from-[#FBFBFB] via-[#FBFBFB] to-[#E8E8E8] shadow-[0px_123px_35px_0px_rgba(0,0,0,0.00),_0px_79px_32px_0px_rgba(0,0,0,0.01),_0px_44px_27px_0px_rgba(0,0,0,0.05),_0px_20px_20px_0px_rgba(0,0,0,0.09),_0px_5px_11px_0px_rgba(0,0,0,0.10)]">
                                <LightningIcon className="w-12 h-12" />
                            </div>
                        }
                        orbits={[
                            {
                                icons: testimonials.map(
                                    (testimonial, index) => (
                                        <div
                                            key={index}
                                            className="w-[120px] h-[120px] overflow-hidden rounded-[133px] bg-gray-400 bg-cover bg-center bg-no-repeat shadow-[0px_44px_12px_0px_rgba(0,0,0,0.00),_0px_28px_11px_0px_rgba(0,0,0,0.03),_0px_16px_10px_0px_rgba(0,0,0,0.11),_0px_7px_7px_0px_rgba(0,0,0,0.19),_0px_2px_4px_0px_rgba(0,0,0,0.22)]"
                                        >
                                            <Image
                                                src={testimonial.image}
                                                alt={`Testimonial ${index + 1}`}
                                                width={220}
                                                height={220}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )
                                ),
                                radius: 180,
                                speed: 25,
                            },
                        ]}
                        className="w-full h-full ml-20"
                    />
                    <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-l from-background to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default Testimonials;

const LightningIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn("w-6 h-6 text-[#FF6B2B]", className)}
            viewBox="0 0 49 67"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_di_966_1395)">
                <motion.path
                    d="M37.6792 21.5018H29.1957C28.5839 21.5018 28.1155 20.9573 28.2069 20.3523L29.8985 9.16102C29.954 8.79514 29.9365 8.4203 29.8473 8.06263C29.758 7.70496 29.5991 7.37304 29.3817 7.08999C29.1643 6.80694 28.8935 6.57957 28.5883 6.42371C28.283 6.26785 27.9507 6.18724 27.6143 6.1875H15.6911C15.1436 6.18768 14.6139 6.4019 14.1961 6.7921C13.7783 7.18231 13.4995 7.72322 13.4092 8.31874L9.55125 33.8425C9.49578 34.2082 9.51322 34.5828 9.60233 34.9403C9.69145 35.2978 9.85012 35.6296 10.0673 35.9126C10.2845 36.1956 10.5549 36.423 10.8599 36.5791C11.1649 36.7351 11.497 36.816 11.8331 36.8161H20.0903C20.6426 36.8161 21.0903 37.2638 21.0903 37.8161V53.534C21.0903 54.5549 22.4401 54.9196 22.9542 54.0376L39.6278 25.435C39.8528 25.0493 39.9794 24.6038 39.9942 24.1455C40.0091 23.6871 39.9117 23.2328 39.7123 22.8303C39.5129 22.4278 39.2189 22.092 38.8611 21.8583C38.5033 21.6245 38.095 21.5013 37.6792 21.5018Z"
                    fill="#D4611E"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
                <motion.path
                    d="M37.6792 21.5018H29.1957C28.5839 21.5018 28.1155 20.9573 28.2069 20.3523L29.8985 9.16102C29.954 8.79514 29.9365 8.4203 29.8473 8.06263C29.758 7.70496 29.5991 7.37304 29.3817 7.08999C29.1643 6.80694 28.8935 6.57957 28.5883 6.42371C28.283 6.26785 27.9507 6.18724 27.6143 6.1875H15.6911C15.1436 6.18768 14.6139 6.4019 14.1961 6.7921C13.7783 7.18231 13.4995 7.72322 13.4092 8.31874L9.55125 33.8425C9.49578 34.2082 9.51322 34.5828 9.60233 34.9403C9.69145 35.2978 9.85012 35.6296 10.0673 35.9126C10.2845 36.1956 10.5549 36.423 10.8599 36.5791C11.1649 36.7351 11.497 36.816 11.8331 36.8161H20.0903C20.6426 36.8161 21.0903 37.2638 21.0903 37.8161V53.534C21.0903 54.5549 22.4401 54.9196 22.9542 54.0376L39.6278 25.435C39.8528 25.0493 39.9794 24.6038 39.9942 24.1455C40.0091 23.6871 39.9117 23.2328 39.7123 22.8303C39.5129 22.4278 39.2189 22.092 38.8611 21.8583C38.5033 21.6245 38.095 21.5013 37.6792 21.5018Z"
                    fill="url(#paint0_linear_966_1395)"
                    fillOpacity="0.7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
            </g>
            <defs>
                <filter
                    id="filter0_di_966_1395"
                    x="0.519531"
                    y="0.1875"
                    width="48.4766"
                    height="66.3482"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="3" />
                    <feGaussianBlur stdDeviation="4.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_966_1395"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_966_1395"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.24444" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_966_1395"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_966_1395"
                    x1="18.227"
                    y1="2.45231"
                    x2="56.1912"
                    y2="37.6499"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FFE0CF" />
                    <stop offset="1" stopColor="#F68340" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const OrbitingIcons = ({
    centerIcon,
    orbits,
    className,
}: {
    centerIcon?: React.ReactNode;
    orbits: Array<{
        icons: React.ReactNode[];
        radius?: number;
        speed?: number;
        rotationDirection?: "clockwise" | "anticlockwise";
    }>;
    className?: string;
}) => {
    // Precalculate all orbit data
    const orbitData = React.useMemo(() => {
        return orbits.map((orbit, orbitIndex) => {
            const radius = orbit.radius || 100 + orbitIndex * 80;
            const speed = orbit.speed || 1;
            const iconCount = orbit.icons.length;

            // Calculate angles for each icon with even distribution
            const angleStep = 360 / iconCount;
            const angles = Array.from(
                { length: iconCount },
                (_, i) => angleStep * i
            );

            // Precalculate positions and animations for each icon
            const iconData = angles.map((angle) => {
                const rotationAngle =
                    orbit.rotationDirection === "clockwise"
                        ? [angle, angle - 360]
                        : [angle, angle + 360];

                return {
                    angle,
                    rotationAngle,
                    position: {
                        x: radius * Math.cos((angle * Math.PI) / 180),
                        y: radius * Math.sin((angle * Math.PI) / 180),
                    },
                    animation: {
                        initial: {
                            rotate: angle,
                            scale: 1,
                            opacity: 1,
                        },
                        animate: {
                            rotate: rotationAngle,
                            scale: 1,
                            opacity: 1,
                        },
                        transition: {
                            rotate: {
                                duration: speed,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        },
                        counterRotation: {
                            initial: { rotate: -angle },
                            animate: {
                                rotate:
                                    orbit.rotationDirection === "clockwise"
                                        ? [-angle, -angle + 360]
                                        : [-angle, -angle - 360],
                            },
                            transition: {
                                duration: speed,
                                repeat: Infinity,
                                ease: "linear",
                            },
                        },
                    },
                };
            });

            return {
                radius,
                speed,
                iconData,
                rotationDirection: orbit.rotationDirection,
            };
        });
    }, [orbits]);

    return (
        <div className={cn("relative", className)}>
            {centerIcon && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    {centerIcon}
                </div>
            )}
            {orbitData.map((orbit, orbitIndex) => (
                <div
                    key={orbitIndex}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ zIndex: orbits.length - orbitIndex }}
                >
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                            width: orbit.radius * 2 + "px",
                            height: orbit.radius * 2 + "px",
                        }}
                    />

                    {orbit.iconData.map((icon, iconIndex) => (
                        <motion.div
                            key={iconIndex}
                            className="absolute"
                            style={{
                                width: "40px",
                                height: "40px",
                                left: `calc(50% - 20px)`,
                                top: `calc(50% - 20px)`,
                                transformOrigin: "center center",
                            }}
                            initial={icon.animation.initial}
                            animate={icon.animation.animate}
                            transition={icon.animation.transition}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: `${orbit.radius}px`,
                                    transformOrigin: "center center",
                                }}
                            >
                                <motion.div
                                    initial={
                                        icon.animation.counterRotation.initial
                                    }
                                    animate={
                                        icon.animation.counterRotation.animate
                                    }
                                    transition={
                                        icon.animation.counterRotation
                                            .transition
                                    }
                                >
                                    {orbits[orbitIndex].icons[iconIndex]}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
};
