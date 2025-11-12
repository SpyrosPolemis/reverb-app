import React from 'react';

// Room Join/Create Component
const RoomForm = ({ roomCode, setRoomCode, onJoin, joining, studentName, setStudentName, actionText = "Join Room" }) => (

    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {actionText}
        </h2>
        <div className="space-y-4">
            <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter Room Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
                onClick={onJoin}
                disabled={joining || !roomCode || !studentName}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {joining ? 'Joining...' : actionText}
            </button>
        </div>
    </div>
);

export default RoomForm;