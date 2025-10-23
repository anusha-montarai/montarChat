import React, { useState, useRef, useEffect } from 'react';
import './InputBox.scss';

const InputBox = ({ onSendMessage, isConnected }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && isConnected) {
            onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    };

    useEffect(() => {
        if (textareaRef.current && !message) {
            textareaRef.current.style.height = 'auto';
        }
    }, [message]);

    return (
        <div className="input-area">
            <form onSubmit={handleSubmit} className="input-container">
                <div className="input-wrapper">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        disabled={!isConnected}
                        className="message-input"
                        rows="1"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || !isConnected}
                    className="send-button"
                    aria-label="Send message"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default InputBox;