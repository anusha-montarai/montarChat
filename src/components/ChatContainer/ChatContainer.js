import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatContainer.scss';

const ChatContainer = ({ messages, typingMessage }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingMessage]);

    const renderMessage = (message, index) => {
        const isUser = message.type === 'user';

        return (
            <div key={index} className={`message-wrapper ${isUser ? 'user-message' : 'bot-message'}`}>
                <div className="message-bubble">
                    <div className="message-content">
                        {isUser ? (
                            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                        ) : (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                    <div className="message-time">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="messages-container">
            {messages.length === 0 && !typingMessage ? (
                <div className="welcome-message">
                    <div className="welcome-icon">👋</div>
                    <h2>Welcome to Montar Chat</h2>
                    <p>Start a conversation by typing a message below.</p>
                </div>
            ) : (
                <>
                    {messages.map((message, index) => renderMessage(message, index))}

                    {/* Show typing indicator */}
                    {typingMessage && (
                        <div className="message-wrapper bot-message typing-message">
                            <div className="message-bubble">
                                <div className="message-content">
                                    {typingMessage === 'Agent is thinking...' || typingMessage === 'Agent is typing...' ? (
                                        <div className="typing-indicator">
                                            <div className="typing-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <span className="typing-text">{typingMessage}</span>
                                        </div>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {typingMessage}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatContainer;