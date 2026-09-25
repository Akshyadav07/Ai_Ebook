import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { booksAPI, chaptersAPI, aiAPI } from '../services/api';

const BookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    try {
      const [bookResponse, chaptersResponse] = await Promise.all([
        booksAPI.getBook(id),
        chaptersAPI.getChapters(id),
      ]);
      setBook(bookResponse.data);
      setChapters(chaptersResponse.data);
      if (chaptersResponse.data.length > 0) {
        setSelectedChapter(chaptersResponse.data[0]);
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookUpdate = async (field, value) => {
    try {
      const response = await booksAPI.updateBook(id, { [field]: value });
      setBook(response.data);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleChapterUpdate = async (chapterId, field, value) => {
    try {
      const response = await chaptersAPI.updateChapter(id, chapterId, { [field]: value });
      setChapters(chapters.map((ch) => (ch.id === chapterId ? response.data : ch)));
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(response.data);
      }
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };

  const handleAddChapter = async () => {
    try {
      const response = await chaptersAPI.createChapter(id, {
        title: 'New Chapter',
        content: '',
      });
      setChapters([...chapters, response.data]);
      setSelectedChapter(response.data);
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await chaptersAPI.deleteChapter(id, chapterId);
      setChapters(chapters.filter((ch) => ch.id !== chapterId));
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(chapters.find((ch) => ch.id !== chapterId) || null);
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleRegenerateChapter = async (chapterId) => {
    try {
      setSaving(true);
      const response = await chaptersAPI.regenerateChapter(id, chapterId);
      setChapters(chapters.map((ch) => (ch.id === chapterId ? response.data : ch)));
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(response.data);
      }
    } catch (error) {
      console.error('Error regenerating chapter:', error);
      alert('Failed to regenerate chapter');
    } finally {
      setSaving(false);
    }
  };

  const handleAiAction = async (action) => {
    if (!selectedText) {
      alert('Please select some text first');
      return;
    }

    setAiLoading(true);
    setAiResult('');

    try {
      let response;
      switch (action) {
        case 'improve':
          response = await aiAPI.improve({ content: selectedText });
          break;
        case 'rewrite':
          response = await aiAPI.rewrite({ content: selectedText });
          break;
        case 'summarize':
          response = await aiAPI.summarize({ content: selectedText });
          break;
        case 'expand':
          response = await aiAPI.expand({ content: selectedText });
          break;
        case 'simplify':
          response = await aiAPI.simplify({ content: selectedText });
          break;
        case 'fixGrammar':
          response = await aiAPI.fixGrammar({ content: selectedText });
          break;
        case 'generateExamples':
          response = await aiAPI.generateExamples({ content: selectedText });
          break;
        case 'continueWriting':
          response = await aiAPI.continueWriting({ content: selectedText });
          break;
        default:
          return;
      }

      setAiResult(response.data.content || response.data.result || 'No result');
    } catch (error) {
      console.error('Error with AI action:', error);
      alert('AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptAiResult = () => {
    if (selectedChapter && aiResult) {
      const newContent = selectedChapter.content.replace(selectedText, aiResult);
      handleChapterUpdate(selectedChapter.id, 'content', newContent);
      setAiResult('');
      setShowAiPanel(false);
      setSelectedText('');
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) {
      setSelectedText(text);
      setShowAiPanel(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Chapters</h2>
              <button
                onClick={handleAddChapter}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedChapter?.id === chapter.id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {chapter.chapter_number}. {chapter.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <Link
              to={`/books/${id}/preview`}
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Preview Book
            </Link>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Book Details */}
            <div className="mb-6 pb-6 border-b">
              <input
                type="text"
                value={book?.title || ''}
                onChange={(e) => handleBookUpdate('title', e.target.value)}
                className="text-2xl font-bold text-gray-900 w-full border-none focus:outline-none focus:ring-0 p-0 mb-2"
                placeholder="Book Title"
              />
              <textarea
                value={book?.description || ''}
                onChange={(e) => handleBookUpdate('description', e.target.value)}
                className="w-full border-none focus:outline-none focus:ring-0 p-0 text-gray-600 resize-none"
                rows="2"
                placeholder="Book description"
              />
            </div>

            {/* Chapter Editor */}
            {selectedChapter ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={selectedChapter.title}
                    onChange={(e) => handleChapterUpdate(selectedChapter.id, 'title', e.target.value)}
                    className="text-xl font-semibold text-gray-900 w-full border-none focus:outline-none focus:ring-0 p-0"
                    placeholder="Chapter Title"
                  />
                  <button
                    onClick={() => handleRegenerateChapter(selectedChapter.id)}
                    disabled={saving}
                    className="ml-4 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm disabled:opacity-50"
                  >
                    {saving ? 'Regenerating...' : 'Regenerate with AI'}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={selectedChapter.content}
                    onChange={(e) => handleChapterUpdate(selectedChapter.id, 'content', e.target.value)}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                    placeholder="Chapter content..."
                  />

                  {/* AI Panel */}
                  {showAiPanel && (
                    <div className="absolute right-0 top-0 bg-white rounded-lg shadow-xl border p-4 w-64 z-10">
                      <h3 className="font-semibold text-gray-900 mb-3">AI Tools</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAiAction('improve')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          ✨ Improve Writing
                        </button>
                        <button
                          onClick={() => handleAiAction('rewrite')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          🔄 Rewrite
                        </button>
                        <button
                          onClick={() => handleAiAction('summarize')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          📝 Summarize
                        </button>
                        <button
                          onClick={() => handleAiAction('expand')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          📈 Make Longer
                        </button>
                        <button
                          onClick={() => handleAiAction('simplify')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          🔤 Simplify
                        </button>
                        <button
                          onClick={() => handleAiAction('fixGrammar')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          ✅ Fix Grammar
                        </button>
                        <button
                          onClick={() => handleAiAction('generateExamples')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          💡 Generate Examples
                        </button>
                        <button
                          onClick={() => handleAiAction('continueWriting')}
                          disabled={aiLoading}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                        >
                          ➡️ Continue Writing
                        </button>
                      </div>

                      {aiLoading && (
                        <div className="mt-4 text-center text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="mt-2">Processing...</p>
                        </div>
                      )}

                      {aiResult && !aiLoading && (
                        <div className="mt-4">
                          <div className="bg-gray-50 rounded p-3 mb-3 text-sm max-h-40 overflow-y-auto">
                            {aiResult}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAcceptAiResult}
                              className="flex-1 bg-indigo-600 text-white py-1 px-3 rounded text-sm hover:bg-indigo-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                setAiResult('');
                                setShowAiPanel(false);
                              }}
                              className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setShowAiPanel(false)}
                        className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No chapters yet. Add your first chapter to start writing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default BookEditor;
