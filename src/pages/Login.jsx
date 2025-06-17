import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { sendPasswordResetEmail } from "firebase/auth";



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
const handleResetPassword = async () => {
  if (!email) {
    alert("Please enter your email first.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent.");
  } catch (err) {
    console.error(err.message);
    alert("Error sending password reset email.");
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-blue-100 px-4">

     <form
  onSubmit={handleLogin}
  className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md mx-4 sm:mx-0"
>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Login to Listify
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-300"
        >
          Login
        </button>
        <span
          className="text-sm text-blue-600 underline cursor-pointer mt-2 block text-center"
          onClick={() => handleResetPassword()}
        >
          Forgot Password?
        </span>
        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-700 underline cursor-pointer">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
