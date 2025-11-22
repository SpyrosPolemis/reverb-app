import React, { useState, useEffect } from 'react';
import { socket } from './Socket';

const TeacherPage = ({ roomCode }) => {
    const [quizQuestion, setQuizQuestion] = useState('');
    const [sentQuestions, setSentQuestions] = useState([]); 
    const [answers, setAnswers] = useState({}); 

    const [studentQuestions, setStudentQuestions] = useState([]);

    // Receive answers from students
    useEffect(() => {
        socket.on('receive_answer', ({ questionId, answer, studentName }) => {
            setAnswers(prev => ({
                ...prev,
                [questionId]: [...(prev[questionId] || []), { studentName, answer }]
            }));
        });

        return () => socket.off('receive_answer');
    }, []);

    // Receive student question updates
    useEffect(() => {
        socket.on("update_student_questions", (updatedList) => {
            setStudentQuestions(updatedList);
        });

        return () => socket.off("update_student_questions");
    }, []);

    const handleSendQuestion = () => {
        if (!quizQuestion.trim()) return;

        const questionId = Date.now().toString();
        
        socket.emit('send_question', {
            roomCode,
            question: quizQuestion,
            questionId
        });

        setSentQuestions(prev => [...prev, { id: questionId, text: quizQuestion }]);
        setQuizQuestion('');
    };

    const handleTeacherAnswerStudent = (questionId) => {
        const text = prompt("Enter your answer:");

        if (!text || !text.trim()) return;

        socket.emit("teacher_answer_student_question", {
            roomCode,
            questionId,
            answer: text
        });
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h2>
            <p className="text-xl text-gray-600">
                Room: <span className="font-semibold text-indigo-600">{roomCode}</span>
            </p>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT SIDE — SEND QUIZ + VIEW ANSWERS */}
                <div className="space-y-6">

                    {/* Send Quiz Question */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Send Quiz Question</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={quizQuestion}
                                onChange={(e) => setQuizQuestion(e.target.value)}
                                placeholder="Type quiz question..."
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleSendQuestion}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Quiz Answers */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Student Answers</h3>

                        {sentQuestions.length === 0 ? (
                            <p className="text-gray-500 italic">No questions sent yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {sentQuestions.map((q) => (
                                    <div
                                        key={q.id}
                                        className="border p-4 rounded bg-gray-50 shadow-sm"
                                    >
                                        <p className="font-semibold text-lg">{q.text}</p>

                                        {/* Answers for this question */}
                                        {answers[q.id] ? (
                                            <ul className="mt-2 space-y-2">
                                                {answers[q.id].map((a, i) => (
                                                    <li
                                                        key={i}
                                                        className="bg-white p-2 rounded border"
                                                    >
                                                        <span className="font-semibold">
                                                            {a.studentName}:
                                                        </span>{" "}
                                                        {a.answer}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic mt-1">
                                                No answers yet.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE — STUDENT QUESTIONS */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                            Student Questions
                        </h3>

                        {studentQuestions.length === 0 ? (
                            <p className="text-gray-500 italic">No student questions yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {[...studentQuestions]
                                    .sort((a, b) => b.upvotes - a.upvotes)
                                    .map((q) => (
                                        <li
                                            key={q.id}
                                            className="p-4 bg-gray-50 border rounded flex flex-col"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-lg">{q.text}</p>
                                                    <p className="text-sm text-gray-500">
                                                        — {q.studentName}
                                                    </p>
                                                </div>

                                                <span className="text-indigo-600 font-semibold">
                                                    👍 {q.upvotes}
                                                </span>
                                            </div>

                                            {/* teacher response */}
                                            {q.answer ? (
                                                <p className="mt-3 pl-2 border-l-4 border-green-500 text-green-700">
                                                    <span className="font-semibold">Teacher:</span>{" "}
                                                    {q.answer}
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={() => handleTeacherAnswerStudent(q.id)}
                                                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Answer
                                                </button>
                                            )}
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

export default TeacherPage;
