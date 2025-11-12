import React, { useState, useEffect, useCallback } from 'react';
import { socket } from './Socket.js'; // Import the shared socket instance

import Header from './components/HeaderComponent.jsx';
import RoomForm from './components/RoomFormComponent.jsx';
import TeacherPage from './TeacherPage.jsx';
import StudentPage from './StudentPage.jsx';
import HomePage from './HomePage.jsx';

function App() {
  const [page, setPage] = useState('home'); // 'home', 'teacher', 'student'
  const [roomCode, setRoomCode] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [joining, setJoining] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    function onConnect() {
      console.log('Connected to socket server');
    }

    function onDisconnect() {
      console.log('Disconnected from socket server');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const handleJoinRoom = useCallback(() => {
    if (roomCode) {
      setJoining(true);
      socket.emit('join_room', roomCode);
      setTimeout(() => {
        setIsInRoom(true);
        setJoining(false);
      }, 500);
    }
  }, [roomCode]);

  const renderPage = () => {
    if (page !== 'home' && !isInRoom) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <RoomForm
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            onJoin={handleJoinRoom}
            joining={joining}
            studentName={studentName}
            setStudentName={setStudentName}
            actionText={page === 'teacher' ? 'Create/Join Room' : 'Join Room'}
          />
        </div>
      );
    }

    switch (page) {
      case 'teacher':
        return <TeacherPage roomCode={roomCode} />;
      case 'student':
        return <StudentPage roomCode={roomCode} studentName={studentName} />;
      case 'home':
      default:
        return (
          <div className="flex-grow flex items-center justify-center">
            <HomePage onSelectRole={setPage} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {<Header onHomeClick={() => {
        setPage('home')
        setIsInRoom(false);
        setRoomCode('');
      }} />}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        REVERB Q&amp;A App
      </footer>
    </div>
  );
}

export default App;