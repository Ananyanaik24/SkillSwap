import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./ChatRoom.css";

const socket = io("http://localhost:5003", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ChatRoom = () => {
  const { user1Id, user2Id } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState("");
  const [mySocketId, setMySocketId] = useState("");
  const messagesEndRef = useRef(null); // For auto-scrolling

  useEffect(() => {
    // Set socket id once
    socket.on("connect", () => {
      setMySocketId(socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    if (user1Id && user2Id) {
      const roomId = [user1Id, user2Id].sort().join("-");
      setRoom(roomId);

      socket.emit("join_room", roomId);

      socket.on("receive_message", (data) => {
        const senderType = data.senderId === socket.id ? "me" : "other";
        setChat((prev) => [...prev, { sender: senderType, text: data.message }]);
      });

      return () => {
        socket.emit("leave_room", roomId);
        socket.off("receive_message");
      };
    }
  }, [user1Id, user2Id]);

  useEffect(() => {
    // Scroll to bottom whenever chat updates
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() && room) {
      socket.emit("send_message", { message, room, senderId: socket.id });
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.code === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h3>Chat Room</h3>
        <p>Room: {room}</p>
      </div>

      <div className="chatroom-messages">
        {chat.length > 0 ? (
          chat.map((c, i) => (
            <div key={i} className={`chat-message ${c.sender}`}>
              {c.text}
            </div>
          ))
        ) : (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        )}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>

      <div className="chatroom-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
