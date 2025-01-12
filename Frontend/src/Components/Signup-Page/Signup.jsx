import React, { useState } from 'react';
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader, Phone, Dock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


import Input from "../Input/Input.jsx";
import PasswordStrength from '../PasswordStrenght/PasswordStrenght.jsx';
import { useAuthStore } from "../Store/AuthStore.js";
import toast from 'react-hot-toast';

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
      
        // Validate all required fields
        if (!firstName|| !lastName || !panCardNumber || !email || !password || !confirmPassword || !phoneNumber) {
          toast.error("All fields are required");
          return;
        }
      
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
      
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address");
          return;
        }
      
        // Validate phone number format (international, E.164 standard)
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
      
          // If user already exists, redirect to login
          if (error.response?.status === 400 && errorMessage.includes("User already exists")) {
            toast.error("User already exists. Redirecting to login...");
            navigate("/login");
          } else {
            toast.error(errorMessage);
          }
        }
      };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-zinc-300 bg-opacity-50 h-min-screen  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-5">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-sky-500 text-transparent bg-clip-text">
                    Create Account
                </h2>
                <form onSubmit={handleSignUp}>
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

                    <Input
                        icon={Mail}
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(evt) => setEmail(evt.target.value)}
                    />

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
                    <Input
                        icon={Phone}
                        type="tel"
                        placeholder="+911234567890"
                        value={phoneNumber}
                        onChange={(evt) => setPhoneNumber(evt.target.value)}
                    />
                     <Input
                        icon={Dock}
                        type="text"
                        placeholder="Pan Card Number"
                        value={panCardNumber}
                        onChange={(evt) => setPanCardNumber(evt.target.value)}
                    />
                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                    <PasswordStrength password={password} />

                    <motion.button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-sky-600 text-white 
                            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-sky-700 focus:outline-none 
                            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 
                            transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
                    </motion.button>
                </form>
            </div>

            <div className="px-8 py-4 bg-zinc-400 bg-opacity-50 flex justify-center">
                <p className="text-sm text-zinc-950">
                    Already have an account?{" "}
                    <Link to={"/login"} className="text-blue-700 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

export default Signup;
