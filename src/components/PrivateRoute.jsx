// components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingStatus) {
    return <p className="text-center mt-10">Checking authentication...</p>; // or a spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
