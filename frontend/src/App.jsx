import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import CreateBook from './pages/CreateBook';
import MyBooks from './pages/MyBooks';
import BookEditor from './pages/BookEditor';
import BookPreview from './pages/BookPreview';
import AIGenerator from './pages/AIGenerator';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/books/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateBook />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookEditor />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/books/:id/preview"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookPreview />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-generator"
            element={
              <ProtectedRoute>
                <Layout>
                  <AIGenerator />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
