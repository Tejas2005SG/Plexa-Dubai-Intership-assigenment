import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../Store/AuthStore.js";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../Input/Input.jsx";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import PasswordStrength from '../PasswordStrenght/PasswordStrenght.jsx';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message } = useAuthStore();
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            toast.error(error.message || "Error resetting password");
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
                        <p className="text-gray-600">Create a new password for your account</p>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium text-center mb-4">{error}</p>}
                    {message && <p className="text-green-500 text-sm font-medium text-center mb-4">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <PasswordStrength password={password} />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
                                font-semibold rounded-lg shadow hover:shadow-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                transition duration-200 mt-6"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;