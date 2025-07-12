import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import Header from '../components/Header';

const AdminApprovalPage = () => {
  const { token, user } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingItems(res.data);
      } catch (err) {
        console.error('Failed to fetch pending items:', err);
      }
    };

    fetchPendingItems();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to approve item:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to reject item:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛠 Admin Item Approval</h1>

        {pendingItems.length === 0 ? (
          <p className="text-gray-500">No pending items for approval.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pendingItems.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 bg-white shadow">
                {item.image && (
                  <img
                    src={`http://localhost:5000/api/items/image/${item._id}`}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Uploaded by: {item.uploadedBy?.name || 'Unknown'}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(item._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;