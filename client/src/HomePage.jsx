import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router

function HomePage() {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        try {
            // Use standard HTTP POST to create the room
            const response = await axios.post('/api/create-room');
            const newRoomCode = response.data.roomCode;
            navigate(`/room/${newRoomCode}`); // Navigate to the new room
        } catch (error) {
            console.error("Error creating room", error);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        try {
            // Use standard HTTP GET to check if room exists
            await axios.get(`/api/check-room/${roomCode}`);
            navigate(`/room/${roomCode}`); // Room exists, navigate to it
        } catch (error) {
            console.error("Error joining room", error);
            alert("Room not found!");
        }
    };

    return (
        <div>
            <button onClick={handleCreateRoom}>Create a New Room</button>
            <hr />
            <form onSubmit={handleJoinRoom}>
                <input
                    type="text"
                    placeholder="Enter 4-letter code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={4}
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
}
export default HomePage;