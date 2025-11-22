import React, { useState, useEffect } from 'react';
import { socket } from './Socket';

const StudentPage = ({ roomCode, studentName }) => {
    const [questions, setQuestions] = useState([]);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [answer, setAnswer] = useState('');

    const [studentQuestionInput, setStudentQuestionInput] = useState('');
    const [studentQuestions, setStudentQuestions] = useState([]);

    // Receive teacher quiz questions
    useEffect(() => {
        const handleReceiveQuestion = ({ question, questionId }) => {
            setQuestions(prev => [...prev, { id: questionId, text: question }]);
            setActiveQuestionId(questionId);
            setAnswer('');
        };

        socket.on('receive_question', handleReceiveQuestion);
        return () => socket.off('receive_question', handleReceiveQuestion);
    }, []);

    // Receive updated student questions
    useEffect(() => {
        socket.on("update_student_questions", (updatedList) => {
            setStudentQuestions(updatedList);
        });

        return () => socket.off("update_student_questions");
    }, []);

    const handleSendAnswer = () => {
        if (!answer.trim() || !activeQuestionId) return;

        socket.emit('send_answer', {
            roomCode,
            answer,
            studentName,
            questionId: activeQuestionId
        });

        setAnswer('');
    };

    const handleSubmitStudentQuestion = () => {
        if (!studentQuestionInput.trim()) return;

        socket.emit("student_submit_question", {
            roomCode,
            studentName,
            text: studentQuestionInput
        });

        setStudentQuestionInput('');
    };

    const handleUpvote = (questionId) => {
        socket.emit("student_upvote_question", { roomCode, questionId });
    };

    const activeQuestion = questions.find(q => q.id === activeQuestionId);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Student Dashboard</h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT SIDE — QUIZ + ANSWER */}
                <div className="space-y-6">
                    {/* Quiz Question */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[150px]">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Quiz Question</h3>
                        {activeQuestion ? (
                            <p className="text-xl text-gray-800">{activeQuestion.text}</p>
                        ) : (
                            <p className="text-gray-500 italic">Waiting for a question...</p>
                        )}
                    </div>

                    {/* Answer Input */}
                    {activeQuestion && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Your Answer</h3>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer..."
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={handleSendAnswer}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE — STUDENT QUESTIONS */}
                <div className="space-y-6">
                    {/* Ask Question */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Ask a Question</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={studentQuestionInput}
                                onChange={(e) => setStudentQuestionInput(e.target.value)}
                                placeholder="Type your question..."
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                onClick={handleSubmitStudentQuestion}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                            >
                                Ask
                            </button>
                        </div>
                    </div>

                    {/* Class Questions */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Class Questions</h3>

                        {studentQuestions.length === 0 ? (
                            <p className="text-gray-500 italic">No questions yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {studentQuestions.map(q => (
                                    <li
                                        key={q.id}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                                    >
                                        <div>
                                            <p className="font-semibold">{q.text}</p>
                                            <p className="text-sm text-gray-500">— {q.studentName}</p>
                                        </div>
                                        <button
                                            onClick={() => handleUpvote(q.id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                                        >
                                            👍 {q.upvotes}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentPage;
