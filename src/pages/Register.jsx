import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/axios'

const Register = () => {
    const [username, Setusername] = useState('');
    const [email, Setemail]= useState('');
    const [password, Setpassword] = useState('');
    const [error, Seterror]= useState('');
    const navigate = useNavigate();

    const handelSubmit = async (e) => {
        e.preventDefault();
        try{
            const res =  await Api.post('/auth/register', {username, email, password});
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify (res.data.user));
            navigate('/home');
        } catch(err){
            Seterror(err.response?.data?.message || 'something went wrong')
        }
    }
    return (
        <div className='suraj1 flex justify-center items-center h-screen bg-gray-100'>
            <div className='bg-white  p-10 rounded-xl shadow-md w-96'>
                <h2 className='text-5xl  font-bold text-center mb-6 text-blue-700 tracking-tighter'>Sing in </h2>
                {error && <p className='text-red-500 text-center mb-4'> {error} </p>}
                <form onSubmit={handelSubmit}>
                    <input className='w-full rounded-xl border border-gray-300 mb-4 p-2'
                     type="text" placeholder='Username' value={username} onChange={(e)=> Setusername(e.target.value)} required/>

                     <input className='w-full rounded-xl border border-gray-300 mb-4 p-2'
                      type="text" placeholder='email' value={email} onChange={(e)=> Setemail(e.target.value)} required/>

                      <input className='w-full rounded-xl border border-gray-300 mb-4 p-2'
                       type="password" placeholder='Password' value={password} onChange={(e)=> Setpassword(e.target.value)} />

                       <button className='w-full  p-3 bg-blue-600 text-white rounded-lg font-bold' type='submit'>
                        Singin
                       </button>
                       <p className='flex justify-center mt-2'>You have already account?
                        <a className='text-blue-500 ml-1'href='/Login'>Login</a> </p>
                </form>
            </div>
        </div>
    )
}

export default Register;