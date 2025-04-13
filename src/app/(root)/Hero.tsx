'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import fluidCursor from '@/hooks/useFluidCursor';
import React, { useEffect } from 'react'

const Hero = () => {

    useEffect(() => {
        // // Initialize the fluid cursor effect
        // const { initFluidCursor } = fluidCursor();
        // initFluidCursor();

        // // Cleanup function to remove the cursor effect on component unmount
        // return () => {
        //     const cursor = document.querySelector('.fluid-cursor');
        //     if (cursor) {
        //         cursor.remove();
        //     }
        // };
        fluidCursor();
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
          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-700 shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 hover:-translate-y-[30px]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"></div>
              <img
                  src="/dashboard.png"
                  alt="HackBox Dashboard"
                  className="relative w-full h-auto"
              />
          </div>
      </section>
  );
}

export default Hero