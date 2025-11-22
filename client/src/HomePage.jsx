import React from 'react';

const HomePage = ({ onSelectRole }) => (
    <>
        <div>
            <div className="mb-12 text-center px-4 md:px-0 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <h1 className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-yellow-500">REVERB</h1>
                <p className="text-gray-600 mb-12 text-center">
                    An interactive platform for teachers and students to engage in real-time Q&amp;A sessions.
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 text-center w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">I am a Teacher</h2>
                    <p className="text-gray-600 mb-6">
                        Create a room, send questions, and view student answers in real-time.
                    </p>
                    <button
                        onClick={() => onSelectRole('teacher')}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Go to Teacher Dashboard
                    </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 text-center w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">I am a Student</h2>
                    <p className="text-gray-600 mb-6">
                        Join a room, receive live questions from your teacher, and send your answers.
                    </p>
                    <button
                        onClick={() => onSelectRole('student')}
                        className="w-full py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                    >
                        Go to Student Dashboard
                    </button>
                </div>
            </div>
        </div>
    </>
);

export default HomePage;