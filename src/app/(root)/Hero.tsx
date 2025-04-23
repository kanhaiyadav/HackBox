"use client";

import { Button } from "@/components/ui/button";
import fluidCursor from "@/hooks/useFluidCursor";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

    useEffect(() => {
        // Check if it's a lower-end device or mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isLowPerformance = window.navigator.hardwareConcurrency < 4;

        setIsLowPowerDevice(isMobile || isLowPerformance);

        console.log(`isMobile: ${isMobile}, isLowPerformance: ${isLowPerformance}`);

        // Only initialize fluid cursor on more powerful devices
        if (!isMobile && !isLowPerformance) {
            // Pass optimized config to reduce CPU/GPU usage
            const optimizedConfig = {
                SIM_RESOLUTION: 64, // Reduced from 128
                DYE_RESOLUTION: 720, // Reduced from 1440
                VELOCITY_DISSIPATION: 4, // Increased to fade quicker
                PRESSURE_ITERATIONS: 12, // Reduced from 20
                SPLAT_RADIUS: 0.2,
                SPLAT_FORCE: 4000, // Reduced from 6000
                DENSITY_DISSIPATION: 4, // Increased to fade quicker
            };

            fluidCursor(optimizedConfig);
        }
    }, []);

    return (
        <section className="w-full px-6 py-20 text-center relative">
            <canvas
                id="fluid"
                className="absolute top-0 left-0 w-full h-full"
            />
            <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-josefin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Mini <span className="text-primary">Tools</span>, Mega
                Convenience.
            </motion.h1>
            <motion.p
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
            >
                Why juggle 10 different websites when HackBox brings everything
                to one clean dashboard?
            </motion.p>
            <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.7 }}
            >
                <Button
                    size="lg"
                    className="px-8"
                    onClick={() => {
                        alert("Explore tools!");
                    }}
                >
                    Start Exploring
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                    View All Tools
                </Button>
            </motion.div>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.6,
                    delay: 0.8,
                    type: "spring",
                    stiffness: 200,
                }}
                whileHover={{
                    boxShadow:
                        "0px 40px 100px 10px oklch(50.83% 0.1436 177.23)",
                    scale: 1.05,
                    y: -30,
                    transition: {
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    },
                }}
                whileTap={{ scale: 0.95 }}
                className="relative max-w-4xl aspect-[16/9] mx-auto rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/5"></div>
                <Image
                    src="/dashboard.png"
                    alt="HackBox Dashboard"
                    className="relative w-full h-auto"
                    fill
                />
            </motion.div>
        </section>
    );
};

export default Hero;
