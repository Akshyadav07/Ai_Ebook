import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex-1 min-w-0 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6 min-w-0">
            <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Account Type</p>
            <p className="font-semibold text-gray-900">Free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
