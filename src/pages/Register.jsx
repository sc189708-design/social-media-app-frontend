import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/axios'

const Register = () => {
    const [username, Setusername] = useState('');
    const [email, Setemail] = useState('');
    const [password, Setpassword] = useState('');
    const [showpassword, setShowpassword] = useState(false)
    const [error, Seterror] = useState('');
    const navigate = useNavigate();

    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Api.post('/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home');
        } catch (err) {
            Seterror(err.response?.data?.message || 'something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090f] px-4 py-10 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -bottom-20 -right-20"></div>

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Heading */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9-3v6m-3-3h6" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Create Account
                    </h1>

                    <p className="text-gray-400 mt-3 text-sm">
                        Join our community and connect with everyone.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-[#15151f]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    <h2 className="text-xl font-semibold text-white mb-2">
                        Sign Up
                    </h2>

                    <p className="text-gray-500 text-sm mb-7">
                        Enter your details to get started.
                    </p>

                    {error && (
                        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-5 text-center">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handelSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Username
                            </label>

                            <input
                                className="w-full bg-[#0d0d15] border border-white/10 rounded-xl p-3.5 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => Setusername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email Address
                            </label>

                            <input
                                className="w-full bg-[#0d0d15] border border-white/10 rounded-xl p-3.5 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => Setemail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showpassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        Setpassword(e.target.value);
                                        Seterror("");
                                    }}
                                    required
                                    className="w-full bg-[#0d0d15] border border-white/10 rounded-xl py-3.5 px-4 pr-12 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowpassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 cursor-pointer"
                                >
                                    {showpassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            className="w-full p-3.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-purple-600/40 active:translate-y-0"
                            type="submit"
                        >
                            Create Account →
                        </button>

                    </form>

                    {/* Login */}
                    <p className="text-center mt-7 text-gray-400 text-sm">
                        Already have an account?
                        <a
                            className="text-purple-400 ml-1 font-semibold hover:text-purple-300 transition"
                            href="/Login"
                        >
                            Login
                        </a>
                    </p>

                </div>

                <p className="text-center text-gray-600 text-xs mt-7">
                    © 2026 Social App. All rights reserved.
                </p>

            </div>
        </div>
    );

}

export default Register;