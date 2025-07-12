import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import Header from '../components/Header';
import heroImage from '/src/assets/h.jpeg';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items/featured/all');
        setFeaturedItems(res.data);
      } catch (err) {
        console.error('Error fetching featured items', err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />

      {/* 🌟 Hero Section */}
      <section className="w-full bg-white py-10 md:py-20 px-6 md:px-16">
  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
    
    {/* Left: Hero Image */}
    <div className="w-full md:w-1/2 h-72 md:h-[400px] overflow-hidden rounded-lg shadow">
      <img
        src="https://thumbs.dreamstime.com/b/women-attending-fashion-clothing-swap-party-to-update-wardrobe-eco-friendly-clothing-exchange-reducing-consumption-flat-198471259.jpg" // or external URL
        alt="ReWear Hero"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Right: Text and Buttons */}
    <div className="w-full md:w-1/2 text-center md:text-left">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">♻️ Welcome to ReWear</h1>
      <p className="text-gray-600 text-lg md:text-xl mb-6">
        A community-powered fashion exchange. Swap, redeem, and give your clothes a second life.
      </p>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        <button
          onClick={() => navigate('/swap')}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md text-white text-sm md:text-base shadow"
        >
          🔁 Start Swapping
        </button>
        <button
          onClick={() => navigate('/items')}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white text-sm md:text-base shadow"
        >
          👕 Browse Items
        </button>
        <button
          onClick={() => navigate('/upload')}
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-md text-white text-sm md:text-base shadow"
        >
          ➕ List an Item
        </button>
        <button
          onClick={() => navigate('/user-dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-md text-white text-sm md:text-base shadow"
        >
          🧾 My Dashboard
        </button>
      </div>
    </div>
  </div>
</section>


      {/* 💡 How it works */}
      <section className="bg-white py-12 px-6 md:px-16 text-center">
        <h2 className="text-2xl font-bold mb-8">🚀 How ReWear Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {[
            {
              title: '1. Upload Clothes',
              desc: 'List your unused clothes by adding images and details. Earn approval before going live.',
            },
            {
              title: '2. Earn & Spend Points',
              desc: 'Earn points when others take your items. Use your points to claim new styles.',
            },
            {
              title: '3. Swap or Redeem',
              desc: 'Swap items directly or redeem through points. Sustainable fashion made easy!',
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🌱 Why ReWear */}
      <section className="bg-gray-100 px-6 md:px-16 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">🌱 Why ReWear?</h2>
        <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Millions of garments are wasted each year. ReWear gives you a platform to contribute to
          sustainability while refreshing your wardrobe. Join a community that values fashion with
          purpose.
        </p>
      </section>

      {/* 🏅 Featured Items */}
      <section className="bg-white px-6 md:px-16 py-12">
        <h2 className="text-2xl font-bold text-center mb-2">🌟 Explore Our Featured Picks</h2>
        <p className="text-center text-gray-600 mb-8">
          A quick peek into the sustainable styles shared by our community.
        </p>

        {featuredItems.length === 0 ? (
          <p className="text-center text-gray-500">No featured items available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/item/${item._id}`)}
                className="border rounded-lg shadow hover:shadow-md transition cursor-pointer bg-white overflow-hidden"
              >
                <img
                  src={`http://localhost:5000/api/items/image/${item._id}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    By {item.uploadedBy?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm font-medium text-blue-600 mt-2">
                    {item.pointCost || 20} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/items')}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm md:text-base transition"
          >
            👀 See All Items
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
