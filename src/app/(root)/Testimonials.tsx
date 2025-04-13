import { Card, CardContent } from '@/components/ui/card';
import React from 'react'

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Full-stack Developer",
        quote: "HackBox has saved me countless hours with its comprehensive toolset. The JSON formatter alone is worth it!",
    },
    {
        name: "Michael Chen",
        role: "DevOps Engineer",
        quote: "I use HackBox daily for quick conversions and validations. It's become an essential part of my workflow.",
    },
    {
        name: "Emma Rodriguez",
        role: "UX Designer",
        quote: "The clean interface and powerful tools make HackBox my go-to resource for quick design and development tasks.",
    },
];

const Testimonials = () => {
  return (
      <section id="testimonials" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 font-josefin">What People Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                  Trusted by thousands of developers and tech professionals
                  worldwide.
              </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                  <Card key={index} className="foreground border-none shadow-input">
                      <CardContent className="p-6">
                          <div className="mb-4 text-muted-foreground">
                              {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400">
                                      ★
                                  </span>
                              ))}
                          </div>
                          <p className="mb-6 italic text-white/80">
                              &ldquo;{testimonial.quote}&rdquo;
                          </p>
                          <div>
                              <p className="font-medium text-white/80">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">
                                  {testimonial.role}
                              </p>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>
  );
}

export default Testimonials