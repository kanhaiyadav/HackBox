'use client';

import { Button } from '@/components/ui/button';
import React from 'react'
import { motion } from 'framer-motion';

const CTA = () => {

    const floatingAnimation = {
        y: [-5, 5],
        transition: {
            y: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            },
        },
    };
    
  return (
      <section className="flex items-center justify-between m-[100px] mt-[200px] foreground rounded-3xl p-8 md:p-16 text-center border-1 border-accent">
          <div>
              <h2 className="text-3xl font-bold mb-6">
                  Ready to Boost Your Productivity?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                  Join thousands of users who already supercharge their
                  workflow with HackBox.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                      Get Started for Free
                  </Button>
                  <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                  >
                      Learn More
                  </Button>
              </div>
          </div>
          <div>
              <motion.img
                  animate={floatingAnimation}
                  src="/app.png"
                  alt="CTA Image"
                  className="hidden md:block  ml-10 drop-shadow-2xl"
              />
          </div>
      </section>
  );
}

export default CTA