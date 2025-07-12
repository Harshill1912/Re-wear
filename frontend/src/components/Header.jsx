import React, { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const Header = () => {
  const { user, setUser, token, logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token && !user) {
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data); // assumes res.data has user info
        }
      } catch (err) {
        console.error('User fetch failed:', err);
      }
    };

    fetchUser();
  }, [token, user, setUser]);

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">👕 ReWear</h1>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
            {user.name?.charAt(0)}
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 underline hover:text-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
