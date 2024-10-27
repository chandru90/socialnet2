import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import MessageInput from "./MessageInput";
import { useSelector } from "react-redux";
import { useAuth } from "./AuthContext";
// Initialize socket connection outside of the component
const socket = io("https://socialnet-e9oe.onrender.com");

const Chatter = () => {
  const [friend, setFriend] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    if (user && user.username) {
      socket.emit("registerUser", user.username);

      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            "https://socialnet-e9oe.onrender.com/api/v1/user/suggested",
            { withCredentials: true }
          );

          // Extract users from response
          if (response.data.success && Array.isArray(response.data.users)) {
            setUsers(response.data.users);
          } else {
            console.error("Expected an array but received:", response.data);
            setUsers([]);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }
      };

      fetchUsers();

      // Listen for incoming messages
      socket.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("receiveMessage"); // Cleanup listener
      };
    }
  }, [user]);

  const handleFriendChange = (e) => {
    setFriend(e.target.value);
  };

  return (
    <div>
      <h2>Chat with {friend || "Select a user"}</h2>
      <select value={friend} onChange={handleFriendChange}>
        <option value="">Select a user</option>
        {Array.isArray(users) &&
          users.map((u) => (
            <option key={u._id} value={u.username}>
              {u.username}
            </option>
          ))}
      </select>
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text} <em>{msg.timestamp}</em>
          </div>
        ))}
      </div>
      <MessageInput socket={socket} user={user} friend={friend} />
    </div>
  );
};

export default Chatter;
