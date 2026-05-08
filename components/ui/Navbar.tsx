'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react'; // Built-in icons for mobile toggle
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // FIX: Using the exact same styling as the original Header from app/page.tsx
    return (
        <header className="sticky top-0 left-0 right-0 z-[100] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    NexusCMS
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Blog</Link>
                    {/* Only smooth scroll to elements if on home page, otherwise these anchor links break on other routes.
                        Since this is a global navbar, we'll route absolute paths. */}
                    <Link href="/#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</Link>
                    <Link href="/#testimonials" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Testimonials</Link>
                </nav>

                {/* Desktop Auth/CTA Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggle />
                    <SignedOut>
                        <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium">
                            Sign In
                        </Link>
                        <Link href="/sign-up" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-colors">
                            Get Started
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium mr-2">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center space-x-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    <div className="ml-4 md:hidden">
                        <SignedIn>
                             <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 absolute w-full left-0 shadow-xl">
                    <div className="px-6 py-4 flex flex-col space-y-4">
                        <Link 
                            href="/blog" 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link 
                            href="/#features" 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link 
                            href="/#testimonials" 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Testimonials
                        </Link>
                        
                        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col space-y-4">
                            <SignedOut>
                                <Link 
                                    href="/sign-in" 
                                    className="text-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors font-medium cursor-pointer"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href="/sign-up" 
                                    className="text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg shadow-lg transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link 
                                    href="/admin/dashboard" 
                                    className="text-center bg-indigo-600/20 text-indigo-400 font-semibold px-5 py-3 rounded-lg hover:bg-indigo-600/30 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Go to Admin Dashboard
                                </Link>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
