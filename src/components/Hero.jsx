import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { motion } from 'framer-motion';

const FlyingNote = ({ speed = 0.05, startX = -6 }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += speed;
      meshRef.current.rotation.z += 0.02;
      if (meshRef.current.position.x > 6) {
        meshRef.current.position.x = startX;
        meshRef.current.position.y = Math.random() * 4 - 2;
        meshRef.current.rotation.z = Math.random() * Math.PI;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[startX, Math.random() * 4 - 2, -1]}>
      <planeGeometry args={[0.4, 0.4]} />
      <meshStandardMaterial color="white" roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 120, friction: 14 },
    delay: 300,
  });

  const bgCanvas = (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      {!isLoggedIn && (
        <Sparkles count={80} speed={1.2} size={1.5} color="#ffffff" scale={[10, 10, 10]} />
      )}
      {isLoggedIn && (
        <>
          <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={120} speed={1.4} size={2} color="#ffffff" scale={[10, 10, 10]} />
        </>
      )}
      {[...Array(isLoggedIn ? 16 : 12)].map((_, i) => (
        <FlyingNote key={i} speed={0.03 + Math.random() * 0.06} startX={-6 - Math.random() * 5} />
      ))}
      <OrbitControls enableZoom={false} autoRotate={isLoggedIn} autoRotateSpeed={2} />
    </Canvas>
  );

  const listify = "LISTIFY";
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-100 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        {bgCanvas}
      </div>

      <animated.div style={props} className="text-center text-white max-w-xl sm:max-w-2xl md:max-w-3xl z-10 space-y-6 px-4 py-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent drop-shadow-lg"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {listify.split('').map((char, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {isLoggedIn ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-base sm:text-lg md:text-xl text-indigo-200 drop-shadow-md">
              You're logged in! Dive into your notes and get organized with Listify.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
              <button
                onClick={() => navigate("/notes")}
                className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 hover:bg-indigo-100 hover:shadow-2xl transition duration-300"
              >
                Go to Notes
              </button>
              <button
                onClick={() => navigate("/news")}
                className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 hover:bg-indigo-600 transition duration-300"
              >
                Explore News
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              Organize Your Day, <br /> One Task at a Time
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-200 mb-8 drop-shadow-md">
              Welcome to your smart to-do assistant. Add, track, and complete tasks with ease.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              Get Started
            </button>
          </>
        )}
      </animated.div>
    </section>
  );
}
