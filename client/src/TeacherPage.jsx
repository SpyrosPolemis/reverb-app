import React, { useState, useEffect } from 'react';
import { socket } from './Socket.js'; // Import the shared socket instance

// Teacher Page Component
const TeacherPage = ({ roomCode }) => {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState([]); // { studentId: '...', answer: '...' }

    // Listen for incoming answers from students
    useEffect(() => {
        const handleReceiveAnswer = (data) => {
            setAnswers((prevAnswers) => [...prevAnswers, data]);
        };

        socket.on('receive_answer', handleReceiveAnswer);

        // Clean up the event listener on component unmount
        return () => {
            socket.off('receive_answer', handleReceiveAnswer);
        };
    }, []); // No need for socket in dependency array as it's a stable import

    const handleSendQuestion = () => {
        if (question.trim() === '') return;
        socket.emit('send_question', { roomCode, question });
        setQuestion(''); // Clear input after sending
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
                Teacher Dashboard
            </h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            {/* Question Sender */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Send a New Question</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSendQuestion}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Send Question
                    </button>
                </div>
            </div>

            {/* Answers Feed */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Student Answers</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {answers.length === 0 ? (
                        <p className="text-gray-500 italic">Waiting for answers...</p>
                    ) : (
                        answers.map((ans, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm font-semibold text-gray-500">
                                    Student: {ans.studentName}
                                </p>
                                <p className="text-lg text-gray-800">{ans.answer}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherPage;