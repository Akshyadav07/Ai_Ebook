import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI } from '../services/api';

const CreateBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    description: '',
    target_audience: '',
    language: 'English',
    writing_style: '',
    number_of_chapters: 8,
    approximate_chapter_length: 1000,
    additional_instructions: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await booksAPI.createBook(formData);
      navigate(`/books/${response.data.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await booksAPI.createBook(formData);
      const bookId = response.data.id;
      
      await booksAPI.generateBook(bookId);
      navigate(`/books/${bookId}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate book. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Book</h1>
        <p className="text-gray-600">Fill in the details to create your book with AI assistance</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Python Programming for Beginners"
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Python Programming"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="A comprehensive guide to learning Python programming from scratch"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="College Students"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="writing_style" className="block text-sm font-medium text-gray-700 mb-2">
            Writing Style
          </label>
          <input
            type="text"
            id="writing_style"
            name="writing_style"
            value={formData.writing_style}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Simple and Educational"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="number_of_chapters" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Chapters *
            </label>
            <input
              type="number"
              id="number_of_chapters"
              name="number_of_chapters"
              value={formData.number_of_chapters}
              onChange={handleChange}
              required
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="approximate_chapter_length" className="block text-sm font-medium text-gray-700 mb-2">
              Approximate Chapter Length (words)
            </label>
            <input
              type="number"
              id="approximate_chapter_length"
              name="approximate_chapter_length"
              value={formData.approximate_chapter_length}
              onChange={handleChange}
              min="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="additional_instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Instructions
          </label>
          <textarea
            id="additional_instructions"
            name="additional_instructions"
            value={formData.additional_instructions}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Any specific requirements or preferences for the book content"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Draft'}
          </button>

          <button
            type="submit"
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;
