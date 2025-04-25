import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Nav = () => {
  return (
      <nav className="px-[10px] sm:px-[50px] lg:px-[100px] mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={30} height={30} className='ml-2 xss:ml-0'/>
              <span className="hidden xss:block text-xl font-bold">HackBox</span>
          </div>
          <div className="flex space-x-2 sm:space-x-4 lg:space-x-6 items-center">
              <a
                  href="#features"
                  className="hover:text-primary transition-colors hidden md:block"
              >
                  Features
              </a>
              <a href="#tools" className="hover:text-primary transition-colors hidden md:block">
                  Tools
              </a>
              <a
                  href="#testimonials"
                  className="hover:text-primary transition-colors hidden md:block"
              >
                  Testimonials
              </a>
              <a href="#faq" className="hover:text-primary transition-colors hidden md:block">
                  FAQ
              </a>
              <Link href='/signin'><Button variant="outline">Login</Button></Link>
              <Link href={'/signup'}><Button>Get Started</Button></Link>
          </div>
      </nav>
  );
}

export default Nav