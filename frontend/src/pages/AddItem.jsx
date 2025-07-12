import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const AddItemPage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    size: '',
    condition: '',
    category: '',
    type: '',
    tags: '',
    pointCost: 20,
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📤 List a New Item</h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <input type="text" name="size" value={form.size} onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <input type="text" name="condition" value={form.condition} onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input type="text" name="type" value={form.type} onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              placeholder="Comma-separated (e.g. casual, denim)" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Point Cost</label>
            <input type="number" name="pointCost" value={form.pointCost} onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white" required />
          </div>

          <div className="md:col-span-2">
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded-md text-lg font-semibold shadow">
              Submit Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;
