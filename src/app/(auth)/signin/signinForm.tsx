'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FiChevronRight, FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

const SigninForm = () => {

    const [hasMounted, setHasMounted] = useState(false);
    const searchParams = useSearchParams();
    const emailVerified = searchParams.get("emailVerified");

    useEffect(() => {
        if (!hasMounted) {
            setHasMounted(true);
        }
    }, [hasMounted]);

    useEffect(() => {
        if (hasMounted && emailVerified === "true") {
            setTimeout(() => {
                toast("Email verified successfully. You can now sign in.");
            }, 200);
        }
    }, [emailVerified, hasMounted]);


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setError(null);
        setIsLoading(true);

        // Simulating API call
        try {
            // Here you would normally make your authentication API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For demo purposes, we'll just redirect to a success page
            console.log("Sign-in successful");
            // Router.push('/dashboard') - would go here in a real app
        } catch (err) {
            console.error("Sign-in error:", err);
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                  Email
              </Label>
              <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-500" />
                  <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                  />
              </div>
          </div>

          <div className="space-y-2">
              <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-300">
                      Password
                  </Label>
                  <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:text-cyan-300"
                  >
                      Forgot password?
                  </Link>
              </div>
              <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-500" />
                  <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-900 border-gray-700 pl-10 focus:border-cyan-500 focus:ring-cyan-500"
                  />
              </div>
          </div>

          <div className="flex items-center space-x-2">
              <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                  }
                  className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
              <Label
                  htmlFor="remember"
                  className="text-sm text-gray-300 cursor-pointer"
              >
                  Remember me for 30 days
              </Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <FiChevronRight className="ml-2" />}
          </Button>
      </form>
  );
}

export default SigninForm