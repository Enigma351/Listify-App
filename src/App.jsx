import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Notes from './pages/Notes';
import News from './pages/News';
import Signup from './pages/Signup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import PrivateRoute from './components/PrivateRoute';



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {user ? (
        <Navbar />
      ) : (
        <div className="w-full h-14 px-6 bg-black text-white flex items-center">
          <Link to="/"
            className="text-xl font-bold  transition-transform duration-300 cursor-pointer hover:scale-110 hover:rotate-2"
            style={{ textShadow: '0 0 8px #ffffff' }}
          >
            LISTIFY
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/news" element={<News />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
