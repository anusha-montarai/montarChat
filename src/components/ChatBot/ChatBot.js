import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import ChatContainer from '../ChatContainer/ChatContainer';
import InputBox from '../InputBox/InputBox';
import { connectSocket, sendMessage, checkWebsocketConnection, disconnectSocket } from '../../services/WebSocketService';
import './ChatBot.scss';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const messageBuffer = useRef('');
    const isProcessingResponse = useRef(false);

    useEffect(() => {
        // Initialize WebSocket connection
        const handleMessage = (data) => {
            console.log('Received message:', data);

            // Handle different message types
            if (data.type === 'meta') {
                handleMetaMessage(data.data);
            } else if (data.type === 'response') {
                // Response type messages contain the actual text chunks
                handleResponseMessage(data.data);
            } else if (data.type === 'text') {
                handleResponseMessage(data.data);
            } else if (data.type === 'json') {
                handleJsonMessage(data.data);
            } else if (data.type === 'message') {
                // Fallback for simple messages
                const newMessage = {
                    type: 'agent',
                    content: data.data || data.message || JSON.stringify(data),
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, newMessage]);
            }
        };

        const handleMetaMessage = (metaData) => {
            console.log('Meta message:', metaData);

            if (metaData === '<response-start>') {
                // Start of a new agent response
                isProcessingResponse.current = false;
                messageBuffer.current = '';
                setTypingMessage('Agent is thinking...');
            } else if (metaData === '<response-end>') {
                // End of agent response - finalize any remaining message
                if (messageBuffer.current.trim()) {
                    const newMessage = {
                        type: 'agent',
                        content: messageBuffer.current.trim(),
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, newMessage]);
                }
                isProcessingResponse.current = false;
                messageBuffer.current = '';
                setTypingMessage('');
            } else if (metaData === '<text-start>') {
                // Start of text content within a response - begin collecting message chunks
                console.log('Text content starting...');
                isProcessingResponse.current = true;
                messageBuffer.current = '';
                setTypingMessage('Agent is typing...');
            } else if (metaData === '<text-end>') {
                // End of text content - finalize this text block as a complete message
                console.log('Text content ended');
                if (messageBuffer.current.trim()) {
                    const newMessage = {
                        type: 'agent',
                        content: messageBuffer.current.trim(),
                        timestamp: Date.now()
                    };
                    setMessages(prev => [...prev, newMessage]);
                    messageBuffer.current = '';
                }
                isProcessingResponse.current = false;
                setTypingMessage('');
            }
        };

        const handleResponseMessage = (textData) => {
            if (isProcessingResponse.current) {
                // Add text to the current message buffer
                messageBuffer.current += textData;
                // Show real-time typing with current buffer content
                setTypingMessage(messageBuffer.current);
            } else {
                // Create a new message if not part of a response stream
                const newMessage = {
                    type: 'agent',
                    content: textData,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, newMessage]);
            }
        };

        const handleJsonMessage = (jsonData) => {
            console.log('JSON message received:', jsonData);
            // Handle JSON data as needed
        };

        // Connect to WebSocket
        connectSocket(handleMessage, 'montar-chat-project');

        // Check connection status
        const checkConnection = () => {
            setIsConnected(checkWebsocketConnection());
        };

        // Check connection every 2 seconds
        const connectionInterval = setInterval(checkConnection, 2000);

        // Initial connection check after a short delay
        setTimeout(checkConnection, 1000);

        // Cleanup on unmount
        return () => {
            clearInterval(connectionInterval);
            disconnectSocket();
        };
    }, []);

    const handleSendMessage = (messageText) => {
        if (!isConnected) {
            console.error('Cannot send message: WebSocket not connected');
            return;
        }

        // Add user message to chat
        const userMessage = {
            type: 'user',
            content: messageText,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMessage]);

        // Send message through WebSocket
        const success = sendMessage(messageText);
        if (!success) {
            // Handle send failure
            const errorMessage = {
                type: 'agent',
                content: 'Failed to send message. Please check your connection.',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="chatbot-container">
            <Header />
            <ChatContainer messages={messages} typingMessage={typingMessage} />
            <InputBox
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
            />
        </div>
    );
};

export default ChatBot;