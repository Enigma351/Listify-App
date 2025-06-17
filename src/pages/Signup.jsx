import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/notes'); // Redirect after successful sign-up
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#223fa3] to-[#dadbf1] px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-black">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300"
        >
          Sign Up
        </button>

        <Link
          to="/login"
          className="block text-center mt-4 text-blue-600 hover:text-blue-800 underline text-sm transition duration-200"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export default Signup;
