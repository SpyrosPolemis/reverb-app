import React, { useState, useEffect } from 'react';
import { socket } from './Socket.js';

const StudentPage = ({ roomCode, studentName }) => {
    const [questions, setQuestions] = useState([]); 
    const [answer, setAnswer] = useState('');
    const [activeQuestionId, setActiveQuestionId] = useState(null);

    // Receive questions
    useEffect(() => {
        const handleReceiveQuestion = ({ question, questionId }) => {
            setQuestions(prev => [...prev, { id: questionId, text: question }]);
            setActiveQuestionId(questionId); // auto-select newest question
            setAnswer('');
        };

        socket.on('receive_question', handleReceiveQuestion);
        return () => socket.off('receive_question', handleReceiveQuestion);
    }, []);

    const handleSendAnswer = () => {
        if (answer.trim() === '' || !activeQuestionId) return;

        socket.emit('send_answer', {
            roomCode,
            answer,
            studentName,
            questionId: activeQuestionId
        });

        setAnswer('');
    };

    const activeQuestion = questions.find(q => q.id === activeQuestionId);

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Student Dashboard</h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            {/* Question Display */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[150px]">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Question</h3>
                {activeQuestion ? (
                    <p className="text-xl text-gray-800">{activeQuestion.text}</p>
                ) : (
                    <p className="text-gray-500 italic">Waiting for a question...</p>
                )}
            </div>

            {/* Choose question (only if multiples exist) */}
            {questions.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                    {questions.map(q => (
                        <button
                            key={q.id}
                            onClick={() => {
                                setActiveQuestionId(q.id);
                                setAnswer('');
                            }}
                            className={`px-4 py-2 rounded-lg border ${
                                activeQuestionId === q.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white'
                            }`}
                        >
                            {q.text.slice(0,40)}...
                        </button>
                    ))}
                </div>
            )}

            {/* Answer box */}
            {activeQuestion && (
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
