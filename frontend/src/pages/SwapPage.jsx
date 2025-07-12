import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SwapPage = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ tag: '' });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFilteredItems();
  }, [filters]);

  const fetchFilteredItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items/search', {
        params: { ...filters }
      });
      const availableItems = res.data.filter(item => item.status === 'available');
      setItems(availableItems);
    } catch (err) {
      console.error('Error fetching items', err);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, tag: value }));

    if (value.length >= 1) {
      try {
        const res = await axios.get('http://localhost:5000/api/items/suggest', {
          params: { type: 'tag', query: value }
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFilters(prev => ({ ...prev, tag: suggestion }));
    setSuggestions([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🔁 Available for Swap</h1>

      <div className="mb-6 relative max-w-md mx-auto">
        <input
          type="text"
          value={filters.tag}
          onChange={handleInputChange}
          placeholder="Search by tag (e.g. jeans, shirt, bag...)"
          className="border px-4 py-2 w-full rounded"
        />

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-48 overflow-y-auto">
            {suggestions.map((tag, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(tag)}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">No items found</p>
        ) : (
          items.map(item => (
            <div
              key={item._id}
              className="bg-white rounded shadow p-4 cursor-pointer"
              onClick={() => navigate(`/item/${item._id}`)}
            >
              <img
                src={`http://localhost:5000/api/items/image/${item._id}`}
                alt={item.title}
                className="w-full h-48 object-cover mb-3"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.pointCost} points</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SwapPage;
