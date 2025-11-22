import React from 'react';

const Header = ({ onHomeClick }) => (
    <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-yellow-500">REVERB</h1>
            <button
                onClick={onHomeClick}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
                Home
            </button>
        </div>
    </header>
);

export default Header;