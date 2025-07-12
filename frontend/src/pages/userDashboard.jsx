import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import Header from '../components/Header';

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [points, setPoints] = useState(0);
  const [myItems, setMyItems] = useState([]);
  const [swappedItems, setSwappedItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [pointsRes, myItemsRes, swapsRes, txRes] = await Promise.all([
          axios.get('http://localhost:5000/api/items/dashboard/points', { headers }),
          axios.get('http://localhost:5000/api/items/me', { headers }),
          axios.get('http://localhost:5000/api/items/dashboard/swaps', { headers }),
          axios.get('http://localhost:5000/api/items/transactions/history', { headers }),
        ]);

        setPoints(pointsRes.data.points);
        setMyItems(myItemsRes.data);
        setSwappedItems(swapsRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (itemId) => {
    const confirm = window.confirm('Are you sure you want to delete this item?');
    if (!confirm) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, { headers });

      setMyItems(prev => prev.filter(item => item._id !== itemId));
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-3xl font-bold mb-2">👋 Welcome, {user?.name || 'User'}!</h2>
          <p className="text-lg">
            🎯 You currently have{' '}
            <span className="text-green-600 font-bold">{points} points</span>.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => window.location.href = '/upload'}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Upload New Item
          </button>
        </div>

        {/* Uploaded Items */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">📤 Your Uploaded Items</h3>
          {myItems.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center shadow text-gray-500 border">
              No items uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <img
                    src={`http://localhost:5000/api/items/image/${item._id}`}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{item.status}</p>

                    <div className="mt-3 flex gap-4">
                      <button
                        onClick={() => window.location.href = `/item/${item._id}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Swapped Items */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">🔄 Completed Swaps / Redemptions</h3>
          {swappedItems.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center shadow text-gray-500 border">
              No swaps or redemptions yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {swappedItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <img
                    src={`http://localhost:5000/api/items/image/${item._id}`}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{item.status}</p>
                    <button
                      onClick={() => window.location.href = `/item/${item._id}`}
                      className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4">📜 Your Transaction History</h3>
            <div className="bg-white rounded-xl shadow-sm border divide-y">
              {transactions.map((tx) => (
                <div key={tx._id} className="p-4 flex items-center gap-4">
                  <img
                    src={`http://localhost:5000/api/items/image/${tx.item._id}`}
                    alt={tx.item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{tx.item.title}</p>
                    <p className="text-sm text-gray-600">
                      {tx.type.replace('_', ' ')} | {tx.points > 0 ? `+${tx.points}` : tx.points} points
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
