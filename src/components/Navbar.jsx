import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="w-full bg-black text-white shadow-md px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className={`text-2xl font-bold transition-transform duration-300 ${
          loaded ? 'animate-fadeIn' : ''
        } hover:scale-110 hover:rotate-2`}
        style={{
          textShadow: '0 0 8px #ffffff, 0 0 12px #ffffff, 0 0 16px #ffffff',
        }}
      >
        LISTIFY
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8 text-lg font-semibold">
        <li className="hover:text-blue-400 transition-all">
          <Link to="/news">News</Link>
        </li>
        <li className="hover:text-blue-400 transition-all">
          <Link to="/notes">Notes</Link>
        </li>
        {!isLoggedIn ? (
          <li className="hover:text-blue-400 transition-all">
            <Link to="/login">Login</Link>
          </li>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-red-700 hover:text-white text-black py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105 text-sm"
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden text-white text-2xl">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-black flex flex-col items-center gap-6 py-6 text-lg font-semibold z-50 md:hidden">
          <li className="hover:text-blue-400 transition-all">
            <Link to="/news" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
          </li>
          <li className="hover:text-blue-400 transition-all">
            <Link to="/notes" onClick={() => setIsMobileMenuOpen(false)}>Notes</Link>
          </li>
          {!isLoggedIn ? (
            <li className="hover:text-blue-400 transition-all">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-white hover:bg-red-700 hover:text-white text-black py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105 text-sm"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
