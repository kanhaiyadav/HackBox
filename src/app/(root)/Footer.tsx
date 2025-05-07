import React from 'react'
import { FiMail, FiGithub, FiTwitter, FiLinkedin, FiFacebook } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const Footer = () => {
  return (
      <footer className="relative py-12">
          <div className="absolute top-0 left-0 w-full h-full glass" />
          <div className="container relative mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 grid-rows-2 lg:grid-rows-1 gap-8 mb-12 content-center lg:items-start">
                  <div className="col-span-full lg:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                          <Image
                              src="/logo.png"
                              alt=""
                              width={30}
                              height={30}
                          />
                          <span className="text-xl font-bold">HackBox</span>
                      </div>
                      <p className="text-white/80 max-w-xs">
                          The ultimate collection of developer tools to
                          streamline your workflow.
                      </p>
                      <div className="flex space-x-4 mt-6">
                          <a
                              href="#"
                              className="text-white/80 hover:text-primary transition-colors"
                          >
                              <FiGithub className="w-5 h-5" />
                          </a>
                          <a
                              href="#"
                              className="text-white/80 hover:text-primary transition-colors"
                          >
                              <FiLinkedin className="w-5 h-5" />
                          </a>
                          <a
                              href="#"
                              className="text-white/80 hover:text-primary transition-colors"
                          >
                              <FiTwitter className="w-5 h-5" />
                          </a>
                          <a
                              href="#"
                              className="text-white/80 hover:text-primary transition-colors"
                          >
                              <FiFacebook className="w-5 h-5" />
                          </a>
                      </div>
                  </div>

                  <div>
                      <h3 className="font-semibold text-lg mb-4">Categories</h3>
                      <ul className="space-y-2">
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Development
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Text
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Productivity
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Calculators
                              </a>
                          </li>
                      </ul>
                  </div>

                  <div>
                      <h3 className="font-semibold text-lg mb-4">Company</h3>
                      <ul className="space-y-2">
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  About
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Blog
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Careers
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-white/80 hover:text-primary transition-colors"
                              >
                                  Contact
                              </a>
                          </li>
                      </ul>
                  </div>

                  <div className="col-span-full md:col-span-1">
                      <h3 className="font-semibold text-lg mb-4">
                          Subscribe
                      </h3>
                      <p className="text-white/80 mb-4 text-sm">
                          Get the latest updates and new tools directly to your
                          inbox.
                      </p>
                      <div className="flex space-x-2">
                          <Input
                              type="email"
                              placeholder="Your email"
                              className="bg-gray-800 border-gray-700 max-w-[350px]"
                          />
                          <Button variant="secondary" className="h-11">
                              <FiMail className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
              </div>
              <div className="pt-8 text-sm text-white/80 flex flex-col md:flex-row justify-between items-center">
                  <p>© 2023 HackBox. All rights reserved.</p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                      <a
                          href="#"
                          className="hover:text-primary transition-colors"
                      >
                          Privacy Policy
                      </a>
                      <a
                          href="#"
                          className="hover:text-primary transition-colors"
                      >
                          Terms of Service
                      </a>
                      <a
                          href="#"
                          className="hover:text-primary transition-colors"
                      >
                          Cookies
                      </a>
                  </div>
              </div>
          </div>
      </footer>
  );
}

export default Footer