import React, { useState, useRef, useEffect, useContext } from 'react';
import { chatWithAI } from '../api';
import { AuthContext } from '../context/AuthContext';
import './ChatBox.css';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am your Jharkand Tourism AI guide. Need help planning a trip or finding out about local spots?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);

    // Reset chat when user changes
    useEffect(() => {
        setMessages([
            { role: 'assistant', content: 'Hi there! I am your Jharkand Tourism AI guide. Need help planning a trip or finding out about local spots?' }
        ]);
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await chatWithAI(userMsg.content, messages);
            setMessages([...updatedMessages, { role: 'assistant', content: res.response }]);
        } catch (error) {
            setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbox-wrapper">
            <button className={`chatbox-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬 AI Guide'}
            </button>
            
            {isOpen && (
                <div className="chatbox-container">
                    <div className="chatbox-header">
                        <h3>Jharkhand AI Guide</h3>
                        <p>Powered by Gemini AI</p>
                    </div>
                    
                    <div className="chatbox-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-bubble ${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-bubble assistant loading">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbox-input" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Ask me about Jharkhand..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !input.trim()}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
