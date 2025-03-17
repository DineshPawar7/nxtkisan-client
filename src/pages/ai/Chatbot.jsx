import { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);

        try {
            // Dummy API response
            const response = await axios.post("https://api.example.com/chat", { message: input });

            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
        } catch {
            setMessages(prevMessages => [...prevMessages, userMessage, { sender: "bot", text: "Error in response!" }]);
        }

        setInput("");
    };

    return (
        <div className="chat-container">
            <h2>Ask GPT</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask questions related to farming..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
