import { Button } from '@/components/ui/button';
import React from 'react'

const CTA = () => {
  return (
      <section className="container mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-16 text-center border border-gray-700">
              <h2 className="text-3xl font-bold mb-6">
                  Ready to Boost Your Productivity?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                  Join thousands of developers who already supercharge their
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
      </section>
  );
}

export default CTA