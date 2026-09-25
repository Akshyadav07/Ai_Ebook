import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { booksAPI } from '../services/api';

const BookPreview = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getBook(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await booksAPI.getBook(id);
      const bookData = response.data;
      
      const content = `
        <html>
          <head>
            <title>${bookData.title}</title>
            <style>
              body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 40px; }
              h2 { margin-top: 40px; margin-bottom: 20px; }
              .chapter { margin-bottom: 40px; }
              .toc { margin: 40px 0; }
              .toc-item { margin: 10px 0; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <h1>${bookData.title}</h1>
            <p><strong>Author:</strong> ${bookData.user?.name || 'Unknown'}</p>
            <p><strong>Topic:</strong> ${bookData.topic}</p>
            
            ${bookData.description ? `<p><em>${bookData.description}</em></p>` : ''}
            
            <div class="toc">
              <h2>Table of Contents</h2>
              ${bookData.chapters?.map((chapter, index) => 
                `<div class="toc-item">${index + 1}. ${chapter.title}</div>`
              ).join('') || ''}
            </div>
            
            ${bookData.introduction ? `
              <div class="chapter">
                <h2>Introduction</h2>
                <p>${bookData.introduction}</p>
              </div>
            ` : ''}
            
            ${bookData.chapters?.map((chapter) => `
              <div class="chapter">
                <h2>Chapter ${chapter.chapter_number}: ${chapter.title}</h2>
                <p>${chapter.content || 'Content not available'}</p>
                ${chapter.sections?.map(section => `
                  <h3>${section.title}</h3>
                  <p>${section.content || ''}</p>
                `).join('') || ''}
              </div>
            `).join('') || ''}
            
            ${bookData.conclusion ? `
              <div class="chapter">
                <h2>Conclusion</h2>
                <p>${bookData.conclusion}</p>
              </div>
            ` : ''}
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Book not found</p>
          <Link to="/books" className="text-indigo-600 hover:text-indigo-800">
            Back to My Books
          </Link>
        </div>
      </Layout>
    );
  }

  const currentChapterData = book.chapters?.[currentChapter];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/books"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to My Books
          </Link>
          <button
            onClick={handleExportPDF}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Export PDF
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Cover */}
          <div className="text-center mb-8 pb-8 border-b">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-12 rounded-lg mb-6">
              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl opacity-90">{book.topic}</p>
            </div>
            <p className="text-gray-600">
              <strong>Author:</strong> {book.user?.name || 'Unknown'}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {book.status}
            </p>
          </div>

          {/* Table of Contents */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            {book.introduction && (
              <div className="py-2 px-4 hover:bg-gray-50 rounded cursor-pointer">
                Introduction
              </div>
            )}
            {book.chapters?.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`py-2 px-4 rounded cursor-pointer transition-colors ${
                  currentChapter === index ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentChapter(index)}
              >
                {index + 1}. {chapter.title}
              </div>
            ))}
            {book.conclusion && (
              <div className="py-2 px-4 hover:bg-gray-50 rounded cursor-pointer">
                Conclusion
              </div>
            )}
          </div>

          {/* Introduction */}
          {book.introduction && (
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {book.introduction}
              </div>
            </div>
          )}

          {/* Chapter Content */}
          {currentChapterData && (
            <div className="mb-8 pb-8 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chapter {currentChapterData.chapter_number}: {currentChapterData.title}
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {currentChapterData.content || 'No content available for this chapter.'}
              </div>
              
              {currentChapterData.sections?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Sections</h3>
                  {currentChapterData.sections.map((section) => (
                    <div key={section.id} className="mb-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{section.title}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{section.content || ''}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                  disabled={currentChapter === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Chapter
                </button>
                <button
                  onClick={() => setCurrentChapter(Math.min(book.chapters.length - 1, currentChapter + 1))}
                  disabled={currentChapter === book.chapters.length - 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          )}

          {/* Conclusion */}
          {book.conclusion && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {book.conclusion}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="text-center">
            <Link
              to={`/books/${book.id}/edit`}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Book
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookPreview;
