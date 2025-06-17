import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!input.trim()) return;
    const newNote = { id: Date.now(), text: input };
    setNotes([newNote, ...notes]);
    setInput('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const text = 'Your Notes';
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };
  const letter = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white drop-shadow-lg"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {text.split('').map((char, index) => (
            <motion.span key={index} variants={letter} className="inline-block">
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </motion.h1>

        <p className="text-center text-white/70 mb-8">
          Capture your thoughts and stay productive!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 p-3 sm:p-4 rounded-xl text-white bg-white/20 placeholder:text-white/70 focus:ring-2 focus:ring-white outline-none"
          />
          <button
            onClick={addNote}
            className="bg-white/20 text-white px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition duration-300 shadow-md hover:shadow-xl"
          >
            Add
          </button>
        </div>

        {notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/50 italic"
          >
            No notes yet. Add one above!
          </motion.div>
        )}

        <div className="space-y-4 mt-6">
          <AnimatePresence>
            {[...notes]
              .sort((a, b) => b.id - a.id)
              .map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  layout
                  className="bg-white/30 text-white p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:scale-[1.02] transform transition duration-300"
                >
                  <input
                    className="w-full sm:flex-1 bg-transparent outline-none text-lg px-2 text-white placeholder-white/80 mb-2 sm:mb-0"
                    value={note.text}
                    onChange={(e) => editNote(note.id, e.target.value)}
                  />
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="sm:ml-4 text-white hover:text-indigo-300 text-xl self-end sm:self-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="hover:fill-indigo-500 transition duration-200"
                    >
                      <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.88 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.88a1 1 0 001.41-1.41L13.41 12l4.88-4.89a1 1 0 000-1.4z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notes;
