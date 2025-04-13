import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { FiCode, FiLayers, FiPieChart, FiShield, FiZap } from 'react-icons/fi';

const toolCategories = [
        {
            name: "Development",
            icon: <FiCode className="w-5 h-5" />,
            tools: [
                "JSON Formatter",
                "Base64 Encoder",
                "Regex Tester",
                "SQL Formatter",
                "JWT Debugger",
            ],
        },
        {
            name: "Text",
            icon: <FiLayers className="w-5 h-5" />,
            tools: [
                "Markdown Preview",
                "Text Diff",
                "Lorem Ipsum",
                "Case Converter",
                "Character Counter",
            ],
        },
        {
            name: "Productivity",
            icon: <FiZap className="w-5 h-5" />,
            tools: [
                "URL Shortener",
                "QR Generator",
                "Password Generator",
                "Timer",
                "Meeting Cost Calculator",
            ],
        },
        {
            name: "Calculators",
            icon: <FiPieChart className="w-5 h-5" />,
            tools: [
                "BMI Calculator",
                "Loan Calculator",
                "Currency Converter",
                "Age Calculator",
                "Tip Calculator",
            ],
        },
        {
            name: "Security",
            icon: <FiShield className="w-5 h-5" />,
            tools: [
                "Password Strength",
                "IP Lookup",
                "User Agent Parser",
                "Hash Generator",
                "SSL Checker",
            ],
        },
        {
            name: "Fun",
            icon: <FiZap className="w-5 h-5" />,
            tools: [
                "Meme Generator",
                "Name Combiner",
                "Horoscope",
                "Love Calculator",
                "Bored Button",
            ],
        },
    ];

const Tools = () => {
  return (
      <section
          id="tools"
          className="container mx-auto px-6 py-20 bg-gray-900/50 rounded-3xl my-10"
      >
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                  Explore Our Tool Categories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                  Organized by category for easy discovery. New tools added
                  regularly.
              </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolCategories.map((category, index) => (
                  <Card
                      key={index}
                      className="border-gray-700 hover:border-primary transition-colors"
                  >
                      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
                          <div className="p-3 rounded-lg bg-primary/10">
                              {category.icon}
                          </div>
                          <div>
                              <CardTitle>{category.name}</CardTitle>
                              <CardDescription>
                                  {category.tools.length}+ tools
                              </CardDescription>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <ul className="space-y-2">
                              {category.tools.map((tool, i) => (
                                  <li key={i} className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                                      {tool}
                                  </li>
                              ))}
                          </ul>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>
  );
}

export default Tools