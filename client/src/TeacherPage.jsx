import React, { useState, useEffect } from 'react';
import { socket } from './Socket.js';

const TeacherPage = ({ roomCode }) => {
    const [questionInput, setQuestionInput] = useState('');
    const [questions, setQuestions] = useState([]); 
    // Format:
    // questions = [ { id, text, answers: [ { studentName, answer } ] } ]

    // Receive new questions back from server
    useEffect(() => {
        const handleReceiveQuestion = ({ question, questionId }) => {
            setQuestions(prev => [
                ...prev,
                { id: questionId, text: question, answers: [] }
            ]);
        };

        socket.on('receive_question', handleReceiveQuestion);
        return () => socket.off('receive_question', handleReceiveQuestion);
    }, []);

    // Receive answers
    useEffect(() => {
        const handleReceiveAnswer = ({ questionId, studentName, answer }) => {
            setQuestions(prev =>
                prev.map(q =>
                    q.id === questionId
                        ? { ...q, answers: [...q.answers, { studentName, answer }] }
                        : q
                )
            );
        };

        socket.on('receive_answer', handleReceiveAnswer);
        return () => socket.off('receive_answer', handleReceiveAnswer);
    }, []);

    const handleSendQuestion = () => {
        if (questionInput.trim() === '') return;

        const questionId = crypto.randomUUID();

        socket.emit('send_question', {
            roomCode,
            question: questionInput,
            questionId
        });

        setQuestionInput('');
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            {/* Question Input */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Send a New Question</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSendQuestion}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Questions + Answers */}
            <div className="space-y-6">
                {questions.length === 0 ? (
                    <p className="text-gray-500 italic">No questions sent yet...</p>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                {q.text}
                            </h3>

                            {q.answers.length === 0 ? (
                                <p className="text-gray-500 italic">Waiting for answers...</p>
                            ) : (
                                <div className="space-y-3">
                                    {q.answers.map((a, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-50 p-3 rounded border border-gray-200"
                                        >
                                            <p className="text-sm font-semibold text-gray-500">
                                                {a.studentName}
                                            </p>
                                            <p className="text-lg text-gray-800">{a.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherPage;
