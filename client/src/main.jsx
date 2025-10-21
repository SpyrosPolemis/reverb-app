// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import your page components
import HomePage from './HomePage';  // Make sure this path is correct
import RoomPage from './RoomPage';  // Make sure this path is correct

// 2. Import your main CSS file
import './index.css';

// 3. Render the app with the router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomCode" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);