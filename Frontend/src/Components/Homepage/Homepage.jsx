import React, { useEffect } from 'react';
import { ArrowRight, UserPlus, FileSpreadsheet, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import Footer from '../Footer/Footer.jsx';
import Navbar from "../Navbar/Navbar.jsx";
import { useAuthStore } from "../Store/AuthStore.js";
import { Link } from 'react-router-dom';

const Homepage = () => {
    const { user } = useAuthStore();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.initially-hidden');
        hiddenElements.forEach((el) => observer.observe(el));

        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach((el) => {
            el.classList.add('animate-floating');
        });

        return () => {
            hiddenElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-20 sm:pt-20 lg:pt-32 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                    <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-100 rounded-full opacity-70 animate-pulse hidden lg:block"></div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-slide-up relative z-10">
                                Streamline Your <span className="text-blue-600">Campaign</span> and <span className="text-blue-600">Invoice</span> Management
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 animate-slide-up animation-delay-200">
                            A comprehensive solution for user registration, campaign management, and dynamic invoice generation with PAN card validation for enhanced security.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                            {user ? (
                                <Link to="/dashboard" className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center font-medium group text-sm sm:text-base">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link to="/login" className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center font-medium group text-sm sm:text-base">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-sm sm:max-w-md">
                            <div className="absolute inset-0 bg-blue-200 rounded-lg transform rotate-3 animate-pulse hidden sm:block"></div>
                            <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-slide-left">
                                <div className="flex justify-between items-center mb-3 sm:mb-4 border-b pb-3 sm:pb-4">
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">Campaign Dashboard</h3>
                                    <span className="text-xs sm:text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm sm:text-base">Campaign #{item}</p>
                                                <p className="text-xs sm:text-sm text-gray-500">Last updated: Today</p>
                                            </div>
                                            <div className="flex space-x-1 sm:space-x-2">
                                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                    <FileText size={14} className="sm:h-18 sm:w-18" />
                                                </button>
                                                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                                    <CheckCircle size={14} className="sm:h-18 sm:w-18" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Banner */}
            <section className="py-6 sm:py-8 bg-gradient-to-r from-blue-50 to-indigo-50 initially-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-700">Trusted by businesses for secure invoice management</h3>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 lg:gap-16">
                        {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company, index) => (
                            <div key={index} className="text-gray-400 font-semibold text-base sm:text-lg lg:text-xl">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4 initially-hidden">
                    Powerful Features
                </h2>
                <p className="text-center text-gray-600 text-sm sm:text-base max-w-3xl mx-auto mb-8 sm:mb-12 initially-hidden">
                    Our comprehensive platform provides everything you need to manage campaigns and invoices efficiently and securely.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 initially-hidden hover:-translate-y-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">User Registration</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                            Streamlined registration process with robust validation for email, PAN card numbers, and secure password management.
                        </p>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Clean registration form
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Secure data handling
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Validation for all fields
                            </li>
                        </ul>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 initially-hidden hover:-translate-y-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Campaign Management</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                            Easily upload, edit, and manage campaigns with CSV file support and inline editing capabilities.
                        </p>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                CSV file upload
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Inline editing
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Admin review tools
                            </li>
                        </ul>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 initially-hidden hover:-translate-y-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Invoice Generation</h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                            Dynamic invoice generation linked to users via PAN Card Numbers with PDF download capabilities.
                        </p>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Dynamic PDF generation
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                PAN Card linking
                            </li>
                            <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                                Filterable invoice list
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto initially-hidden">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 lg:p-10 text-white">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Secure & Compliant</h2>
                            <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">
                                Our platform ensures maximum security with PAN card validation before invoice uploads, keeping your sensitive data protected and compliant with regulations.
                            </p>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                        <h3 className="text-lg sm:text-xl font-semibold mb-1">PAN Verification</h3>
                                        <p className="text-blue-100 text-sm sm:text-base">Verify PAN cards before any invoice upload to ensure authenticity</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300" />
                                    </div>
                                    <div className="ml-3 sm:ml-4">
                                        <h3 className="text-lg sm:text-xl font-semibold mb-1">Data Encryption</h3>
                                        <p className="text-blue-100 text-sm sm:text-base">All sensitive data is encrypted using industry-standard protocols</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10">
                            <div className="relative h-full flex items-center">
                                <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full opacity-50 animate-ping hidden sm:block"></div>
                                <div className="space-y-4 sm:space-y-6 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Why Our Security Matters</h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                                <span className="text-blue-700 font-bold text-xs sm:text-base">01</span>
                                            </div>
                                            <p className="text-gray-600 text-sm sm:text-base">Prevent unauthorized access with strict authentication</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                                <span className="text-blue-700 font-bold text-xs sm:text-base">02</span>
                                            </div>
                                            <p className="text-gray-600 text-sm sm:text-base">Ensure document authenticity with PAN verification</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                                <span className="text-blue-700 font-bold text-xs sm:text-base">03</span>
                                            </div>
                                            <p className="text-gray-600 text-sm sm:text-base">Protect against fraud with comprehensive validation checks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white initially-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Delivering Real Results</h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                            Our platform has helped businesses streamline their operations and improve efficiency.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
                        {[
                            { value: "98%", label: "Customer Satisfaction" },
                            { value: "50K+", label: "Invoices Generated" },
                            { value: "30%", label: "Time Saved" },
                            { value: "24/7", label: "Support" }
                        ].map((stat, index) => (
                            <div key={index} className="p-4 sm:p-6 bg-gray-800 rounded-xl">
                                <div className="floating">
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-1 sm:mb-2">{stat.value}</div>
                                    <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm основании:16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12 sm:mb-16 initially-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-white opacity-5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 sm:w-60 h-48 sm:h-60 bg-white opacity-5 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Get Started?</h2>
                        <p className="text-blue-100 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
                            Streamline your campaign management and invoice generation process today with our secure PAN-validated system.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium text-sm sm:text-lg flex items-center justify-center group">
                                Register Now
                                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-medium text-sm sm:text-lg">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .animate-slide-up {
                    animation: slideUp 0.6s ease-out forwards;
                }
                .animate-slide-left {
                    animation: slideLeft 0.8s ease-out forwards;
                }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                .initially-hidden {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .animate-fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                .animate-floating {
                    animation: floating 3s ease-in-out infinite;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes floating {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
            `}</style>
        </div>
    );
};

export default Homepage;