
import React from 'react';
import { Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-4">              InvoiceBridge
                        </h3>
                        <p className="mb-4 text-gray-400">
                            Streamlining campaign management and invoice generation with security and efficiency.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {["Home", "About", "Features", "Pricing", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/"
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {["User Registration", "Campaign Management", "Invoice Generation", "Data Analytics", "Support"].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/"
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <p className="flex items-center text-gray-400">
                                <Mail size={18} className="mr-2 text-blue-400" />
                                support@invoicepro.com
                            </p>
                            <form className="mt-4">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-800 w-full p-3 rounded text-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © 2025 InvoicePro. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</Link>
                        <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</Link>
                        <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
