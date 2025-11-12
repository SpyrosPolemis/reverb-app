import React, { useState, useEffect } from 'react';
import { socket } from './socket.js'; // Import the shared socket instance

const StudentPage = ({ roomCode }) => {
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    // Listen for new questions from the teacher
    useEffect(() => {
        const handleReceiveQuestion = (question) => {
            setCurrentQuestion(question);
            setAnswer(''); // Clear old answer when a new question arrives
        };

        socket.on('receive_question', handleReceiveQuestion);

        return () => {
            socket.off('receive_question', handleReceiveQuestion);
        };
    }, []);

    const handleSendAnswer = () => {
        if (answer.trim() === '') return;
        socket.emit('send_answer', { roomCode, answer });
        setAnswer(''); // Clear input after sending
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Student Dashboard</h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[150px] flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Question from Teacher</h3>
                {currentQuestion ? (
                    <p className="text-xl text-gray-800">{currentQuestion}</p>
                ) : (
                    <p className="text-gray-500 italic">Waiting for a question...</p>
                )}
            </div>

            {currentQuestion && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Your Answer</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer..."
                            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleSendAnswer}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Send Answer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPage;