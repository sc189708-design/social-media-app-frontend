import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../api/axios"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await Api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090f] px-4 py-10 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -bottom-20 -right-20"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 8h10M7 12h6m-9 9 3-4h11a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 2 3Z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Welcome Back
                    </h1>

                    <p className="text-gray-400 mt-2 text-sm">
                        Sign in to continue your social journey.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#15151f]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/40">

                    <h2 className="text-xl font-semibold text-white mb-2">
                        Login to your account
                    </h2>

                    <p className="text-gray-500 text-sm mb-7">
                        Enter your credentials below.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                                    />
                                </svg>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className="w-full bg-[#0d0d15] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className="w-full bg-[#0d0d15] border border-white/10 rounded-xl py-3.5 px-4 pr-12 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 cursor-pointer"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 accent-purple-500 cursor-pointer"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-400 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 transition-all duration-300 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? "Logging in..." : "Login →"}
                        </button>
                    </form>

                    {/* Signup */}
                    <div className="mt-7 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/"
                                className="text-purple-400 font-semibold hover:text-purple-300 transition"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>

                </div>

                <p className="text-center text-gray-600 text-xs mt-7">
                    © 2026 Social App. All rights reserved.
                </p>

            </div>
        </div>
    );
}

export default Login;