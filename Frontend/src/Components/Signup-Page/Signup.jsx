import React, { useState } from 'react';
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader, Phone, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Input/Input.jsx";
import PasswordStrength from '../PasswordStrenght/PasswordStrenght.jsx';
import { useAuthStore } from "../Store/AuthStore.js";
import toast from 'react-hot-toast';
import signupImage from '../../assets/invoice-image.png';

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [panCardNumber, setPanCardNumber] = useState('');
    const navigate = useNavigate();

    const { signup, error, isLoading } = useAuthStore();

    const handleSignUp = async (evt) => {
        evt.preventDefault();

        if (!firstName || !lastName || !panCardNumber || !email || !password || !confirmPassword || !phoneNumber) {
            toast.error("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error("Please enter a valid phone number in international format (e.g., +918766816061)");
            return;
        }

        try {
            const response = await signup(firstName, lastName, email, password, confirmPassword, phoneNumber, panCardNumber);
            toast.success("Signup successful! Please verify your OTP");
            navigate("/verify-email");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";

            if (error.response?.status === 400 && errorMessage.includes("User already exists")) {
                toast.error("User already exists. Redirecting to login...");
                navigate("/login");
            } else {
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* {/* Image Section */}
                <div className="hidden md:block md:w-2/5 relative bg-gradient-to-br from-blue-600 to-indigo-800">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold text-white mb-4"
                        >
                           Invoicing with clarity and trust.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-white/80"
                        >
                            Start your journey with us today
                        </motion.p>

                        {/* Decorative elements */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 w-24 h-1 bg-white/30 rounded-full"
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute bottom-0 left-0 right-0 h-32 bg-white/10 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Form Section - Wider */}
                <div className="w-full md:w-3/5 p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-600">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                icon={User}
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(evt) => setFirstName(evt.target.value)}
                            />
                            <Input
                                icon={User}
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(evt) => setLastName(evt.target.value)}
                            />
                        </div>

                        <Input
                            icon={Mail}
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(evt) => setPassword(evt.target.value)}
                            />
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(evt) => setConfirmPassword(evt.target.value)}
                            />
                        </div>

                        <PasswordStrength password={password} />

                        <Input
                            icon={Phone}
                            type="tel"
                            placeholder="+911234567890"
                            value={phoneNumber}
                            onChange={(evt) => setPhoneNumber(evt.target.value)}
                        />
                        <Input
                            icon={CreditCard}
                            type="text"
                            placeholder="Pan Card Number"
                            value={panCardNumber}
                            onChange={(evt) => setPanCardNumber(evt.target.value)}
                        />

                        {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}

                        <motion.button
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
                                font-semibold rounded-lg shadow hover:shadow-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                transition duration-200 mt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader className="animate-spin mx-auto" size={24} />
                            ) : (
                                "Sign Up"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 font-medium hover:underline hover:text-blue-700"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Signup;