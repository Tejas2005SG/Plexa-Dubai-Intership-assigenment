import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../Store/AuthStore.js";
import Input from "../Input/Input.jsx";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, forgotPassword, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            toast.success("Password reset link sent to your email");
        } catch (error) {
            toast.error(error.message || "Failed to send reset link");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h2>
                        <p className="text-gray-600">
                            {!isSubmitted 
                                ? "Enter your email to receive a reset link" 
                                : "Check your email for the reset link"}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            
                            <Input
                                icon={Mail}
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
                                    font-semibold rounded-lg shadow hover:shadow-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                    transition duration-200"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader className="h-5 w-5 animate-spin mx-auto" />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
                            >
                                <Mail className="h-8 w-8 text-blue-600" />
                            </motion.div>
                            <p className="text-gray-700">
                                We've sent a password reset link to <span className="font-medium">{email}</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="px-8 py-4 bg-gray-50 flex justify-center">
                    <Link
                        to="/login"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;