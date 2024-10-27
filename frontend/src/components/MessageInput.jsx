import React, { useState } from "react";

const MessageInput = ({ socket, user, friend }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message && friend) {
      const msg = {
        sender: user.username,
        receiver: friend,
        text: message,
        timestamp: new Date().toLocaleTimeString(), // Add timestamp
      };
      socket.emit("sendMessage", msg); // Emit immediate message
      setMessage("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage} disabled={!friend}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
