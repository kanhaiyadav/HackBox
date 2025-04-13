import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { FiLayers, FiShield, FiZap } from 'react-icons/fi';

const Features = () => {
  return (
      <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose HackBox?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                  HackBox brings together all the essential tools you need in
                  one beautifully designed, easy-to-use platform.
              </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-gray-700 hover:border-primary transition-colors">
                  <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <FiZap className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Lightning Fast</CardTitle>
                      <CardDescription>
                          All tools load instantly with no unnecessary bloat.
                      </CardDescription>
                  </CardHeader>
              </Card>
              <Card className="border-gray-700 hover:border-primary transition-colors">
                  <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <FiLayers className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Comprehensive</CardTitle>
                      <CardDescription>
                          50+ carefully selected tools covering all your needs.
                      </CardDescription>
                  </CardHeader>
              </Card>
              <Card className="border-gray-700 hover:border-primary transition-colors">
                  <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <FiShield className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Privacy Focused</CardTitle>
                      <CardDescription>
                          All processing happens in your browser - no data sent
                          to servers.
                      </CardDescription>
                  </CardHeader>
              </Card>
          </div>
      </section>
  );
}

export default Features