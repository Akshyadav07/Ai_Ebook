import React from 'react';

const AIGenerator = () => {
  return (
    <div className="w-full flex-1 min-w-0 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Generator</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        <p className="text-gray-600">
          AI generation tools are integrated into the book editor. Create a book and use the AI tools
          in the editor to generate content.
        </p>
      </div>
    </div>
  );
};

export default AIGenerator;
