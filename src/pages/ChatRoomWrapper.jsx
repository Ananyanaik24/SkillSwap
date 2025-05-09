// src/pages/ChatRoomWrapper.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom'; // Assuming ChatRoom.jsx already exists
import { io } from 'socket.io-client';

// Initialize socket connection (ensure the URL matches your backend configuration)
const socket = io('http://localhost:5004'); // Adjust URL if needed

const ChatRoomWrapper = () => {
  // Get the other user's ID from the URL params
  const { otherUserId } = useParams();

  return (
    // Pass socket and otherUserId to ChatRoom component
    <ChatRoom socket={socket} otherUserId={otherUserId} />
  );
};

export default ChatRoomWrapper;
