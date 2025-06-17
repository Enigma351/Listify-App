import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const cachedNews = JSON.parse(localStorage.getItem('news'));
    const lastFetched = localStorage.getItem('newsFetchedAt');

    if (cachedNews && lastFetched && Date.now() - lastFetched < 3600000) {
      setArticles(cachedNews);
    } else {
      const fetchNews = async () => {
        try {
          const res = await axios.get(
            `https://newsdata.io/api/1/news?apikey=pub_413960c9b4284bff8956266f9505e9ec&country=in&language=en`
          );
          setArticles(res.data.results || []);
          localStorage.setItem('news', JSON.stringify(res.data.results));
          localStorage.setItem('newsFetchedAt', Date.now());
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      };

      fetchNews();
    }
  }, []);

  const title = "Today's News";
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };
  const letter = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 18,
      },
    },
  };

  return (
    <div className="min-h-[100vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <motion.h1
            className="text-4xl font-bold text-center flex-1 drop-shadow-lg"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {title.split('').map((char, idx) => (
              <motion.span key={idx} variants={letter} className="inline-block">
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 hover:bg-white/20"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-sm text-white/80 mb-4 leading-relaxed max-h-32 overflow-hidden">
                {article.description || 'No description available.'}
              </p>
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-300 hover:text-indigo-400 font-semibold underline underline-offset-4 transition"
                >
                  Read full article →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
