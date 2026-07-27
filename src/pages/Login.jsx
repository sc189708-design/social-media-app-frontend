import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../api/axios"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, seterror] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await Api.post('/auth/login', {email, password});
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home')
        } catch (err) {
             seterror(err.response?.data?.message || 'Some thing wrong')
        }
    } ;
    return(
           <div className="suraj2 flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-md w-96">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Account nahi hai?{' '}
                    <a href="/" className="text-blue-400">Sing up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;