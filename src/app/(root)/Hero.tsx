'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import fluidCursor from '@/hooks/useFluidCursor';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

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
      <section className="container mx-auto px-6 py-20 text-center relative">
          <canvas id="fluid" className="absolute top-0 left-0 w-full h-full" />
          <Badge variant="secondary" className="mb-4">
              50+ TOOLS AT YOUR FINGERTIPS
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-josefin">
              Mini <span className="text-primary">Tools</span>, Mega
              Convenience.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Why juggle 10 different websites when HackBox brings everything to
              one clean dashboard?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button size="lg" className="px-8"
                  onClick={() => {
                    alert('Explore tools!');
                }}
              >
                  Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                  View All Tools
              </Button>
          </div>
          <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0, transition: {duration: 0.5, type: 'spring', stiffness: 200} }}
              whileHover={{boxShadow: '0px 40px 100px 10px oklch(50.83% 0.1436 177.23)', scale: 1.05, y: -30, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}}
              whileTap={{ scale: 0.95 }}
              className="relative max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/5"></div>
              <img
                  src="/dashboard.png"
                  alt="HackBox Dashboard"
                  className="relative w-full h-auto"
              />
          </motion.div>
      </section>
  );
}

export default Hero