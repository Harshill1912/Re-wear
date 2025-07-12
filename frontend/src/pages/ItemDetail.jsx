import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import Header from '../components/Header';

const ItemDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError('Item not found or failed to fetch');
      }
    };

    fetchItem();
  }, [id]);

  const handleSwap = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/items/swap/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Swap successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Swap failed');
    }
  };

  const handleRedeem = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/items/redeem/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item redeemed!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Redemption failed');
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {error ? <p className="text-red-600 text-lg">{error}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row gap-8 p-6">
          <div className="w-full md:w-1/2">
            <img
              src={`http://localhost:5000/api/items/image/${item._id}`}
              alt={item.title}
              className="w-full h-80 object-cover rounded-lg border border-gray-200"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-3">{item.title}</h2>
              <p className="text-gray-700 mb-4">{item.description}</p>

              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Size:</strong> {item.size}</li>
                <li><strong>Condition:</strong> {item.condition}</li>
                <li><strong>Type:</strong> {item.type}</li>
                <li><strong>Category:</strong> {item.category}</li>
                <li><strong>Uploader:</strong> {item.uploadedBy?.name || 'Anonymous'}</li>
                <li><strong>Status:</strong> {item.status || 'Available'}</li>
              </ul>

              <p className="text-xl font-semibold text-green-600 mt-4">
                🎯 {item.pointCost || 20} Points Required
              </p>
            </div>

            <div className="mt-6">
              {item.status === 'available' ? (
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleSwap}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    🔁 Request Swap
                  </button>
                  <button
                    onClick={handleRedeem}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    💰 Redeem with Points
                  </button>
                </div>
              ) : (
                <p className="text-red-500 font-medium text-sm mt-4">
                  ❌ This item is not available right now.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
