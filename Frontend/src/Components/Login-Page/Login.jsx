import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Input/Input.jsx";
import { useAuthStore } from "../Store/AuthStore.js";
import toast from "react-hot-toast";
import loginImage from '../../assets/invoice-image.png'; // Replace with your actual image path

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Email and password are required");
			return;
		}

		try {
			await login(email, password);
			toast.success("Logged in successfully!");
			navigate("/dashboard");
		} catch (error) {
			console.log(error);
			toast.error(error.response?.data?.message || "Login failed. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
			>
				{/* Image Section */}

				<div className="hidden md:block md:w-2/5 relative bg-gradient-to-br from-blue-600 to-indigo-800">
					<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-4xl font-bold text-white mb-4"
						>
							Welcome Again
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

				{/* Form Section */}
				<div className="w-full md:w-1/2 p-8 md:p-10">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
						<p className="text-gray-600">Sign in to your account</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-4">
						<Input
							icon={Mail}
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<Input
							icon={Lock}
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
									Remember me
								</label>
							</div>

							<Link
								to="/forgot-password"
								className="text-sm text-blue-600 hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						{error && <p className="text-red-500 text-sm font-medium">{error}</p>}

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
                                font-semibold rounded-lg shadow hover:shadow-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                transition duration-200 mt-4"
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader className="animate-spin mx-auto" size={24} />
							) : (
								"Login"
							)}
						</motion.button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600 text-sm">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-blue-600 font-medium hover:underline hover:text-blue-700"
							>
								Sign up
							</Link>
						</p>
					</div>

					{/* Social Login */}
					{/* <div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                                    rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
								</svg>
							</button>

							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                                    rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
								</svg>
							</button>
						</div>
					</div> */}
				</div>
			</motion.div>
		</div>
	);
};

export default LoginPage;