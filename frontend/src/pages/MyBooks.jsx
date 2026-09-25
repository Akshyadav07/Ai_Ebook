import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksAPI.deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleDuplicate = async (bookId) => {
    try {
      const response = await booksAPI.duplicateBook(bookId);
      setBooks([response.data, ...books]);
    } catch (error) {
      console.error('Error duplicating book:', error);
      alert('Failed to duplicate book');
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <Link
            to="/books/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create New Book
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : book.status === 'generating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {book.status}
                    </span>
                    <span className="text-sm text-gray-500">{book.chapters_count} chapters</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{book.topic}</p>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Created: {new Date(book.created_at).toLocaleDateString()}</p>
                    <p>Updated: {new Date(book.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/books/${book.id}/edit`}
                      className="flex-1 bg-indigo-600 text-white text-center py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/books/${book.id}/preview`}
                      className="flex-1 bg-gray-600 text-white text-center py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      Preview
                    </Link>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDuplicate(book.id)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors text-sm"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md hover:bg-red-100 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first book to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/books/create"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Book
              </Link>
            )}
          </div>
        )}
      </div>
  );
};

export default MyBooks;
