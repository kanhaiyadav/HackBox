import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const Nav = () => {
  return (
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" width={30} />
              <span className="text-xl font-bold">HackBox</span>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
              <a
                  href="#features"
                  className="hover:text-primary transition-colors"
              >
                  Features
              </a>
              <a href="#tools" className="hover:text-primary transition-colors">
                  Tools
              </a>
              <a
                  href="#testimonials"
                  className="hover:text-primary transition-colors"
              >
                  Testimonials
              </a>
              <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
              </a>
              <Link href='/signin'><Button variant="outline">Login</Button></Link>
              <Link href={'/signup'}><Button>Get Started</Button></Link>
          </div>
      </nav>
  );
}

export default Nav