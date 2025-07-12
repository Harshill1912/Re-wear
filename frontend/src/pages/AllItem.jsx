import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ tag: '', category: '', type: '', size: '', condition: '', sort: '' });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch filtered items
  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items/search', { params: filters });
        setItems(res.data);
      } catch (err) {
        console.error('Failed to fetch filtered items:', err);
      }
    };

    const delay = setTimeout(() => {
      fetchFilteredItems();
    }, 300);

    return () => clearTimeout(delay);
  }, [filters]);

  // Fetch tag suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!filters.tag.trim()) return setSuggestions([]);
      try {
        const res = await axios.get('http://localhost:5000/api/items/suggest', {
          params: { type: 'tag', query: filters.tag.trim() },
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };
    fetchSuggestions();
  }, [filters.tag]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSuggestionClick = (tag) => {
    setFilters({ ...filters, tag });
    setSuggestions([]);
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              name="tag"
              placeholder="Search by tag"
              value={filters.tag}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border"
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 rounded z-10 max-h-40 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Category Filter */}
          <select name="category" onChange={handleChange} value={filters.category} className="p-2 rounded border">
            <option value="">Category</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* Type Filter */}
          <select name="type" onChange={handleChange} value={filters.type} className="p-2 rounded border">
            <option value="">Type</option>
            <option value="t-shirt">t-shirt</option>
            <option value="Shirt">Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Pants">Pants</option>
          </select>

          {/* Size Filter */}
          <select name="size" onChange={handleChange} value={filters.size} className="p-2 rounded border">
            <option value="">Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Condition Filter */}
          <select name="condition" onChange={handleChange} value={filters.condition} className="p-2 rounded border">
            <option value="">Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Like New">Like New</option>
          </select>

          {/* Sort Filter */}
          <select name="sort" onChange={handleSortChange} value={filters.sort} className="p-2 rounded border">
            <option value="">Sort</option>
            <option value="min">Min Points</option>
            <option value="max">Max Points</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-sm">No items found.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/items/${item._id}`)}
            >
              <img
                src={`http://localhost:5000/api/items/image/${item._id}`}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.category} - {item.size}</p>
                <p className="text-blue-500 text-sm font-medium">{item.pointCost || 20} pts</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllItemsPage;
