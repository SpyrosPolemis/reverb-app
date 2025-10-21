import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from './socket.js';

function RoomPage() {
    const { roomCode } = useParams(); // Get room code from URL (e.g., /room/ABCD)
    const [questions, setQuestions] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');

    // Effect to handle joining the room and listening for events
    useEffect(() => {
        // 1. Tell the server we want to join this specific room
        socket.emit('join_room', roomCode);

        // 2. Listen for new questions from the server
        const handleNewQuestion = (newQuestion) => {
            setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        };
        socket.on('new_question_received', handleNewQuestion);

        // 3. Listen for vote updates from the server
        const handleVoteUpdate = (data) => {
            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === data.id ? { ...q, votes: q.votes + 1 } : q // In a real app, use data.newVoteCount
                )
            );
        };
        socket.on('question_voted', handleVoteUpdate);

        // 4. Clean up listeners when the component unmounts
        return () => {
            socket.off('new_question_received', handleNewQuestion);
            socket.off('question_voted', handleVoteUpdate);
        };
    }, [roomCode]); // Re-run if the roomCode changes

    // Function to post a new question
    const handlePostQuestion = (e) => {
        e.preventDefault();
        if (newQuestionText.trim()) {
            // Send the new question to the server
            socket.emit('post_question', { roomCode, questionText: newQuestionText });
            setNewQuestionText('');
        }
    };

    // Function to vote on a question
    const handleVote = (questionId) => {
        socket.emit('vote_question', { roomCode, questionId });
    };

    return (
        <div>
            <h1>Welcome to Room: {roomCode}</h1>

            <form onSubmit={handlePostQuestion}>
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                />
                <button type="submit">Post</button>
            </form>

            <div className="question-list">
                <h2>Questions:</h2>
                {questions
                    .sort((a, b) => b.votes - a.votes) // Show highest voted first
                    .map((q) => (
                        <div key={q.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                            <p>{q.text}</p>
                            <p>Votes: {q.votes}</p>
                            <button onClick={() => handleVote(q.id)}>Vote Up</button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default RoomPage;