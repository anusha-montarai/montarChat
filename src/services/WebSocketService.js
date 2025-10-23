// WebSocket connection variables
let socket;
let sessionId = null;

// Read configuration from environment variables with fallbacks
const WS_HOSTNAME = process.env.REACT_APP_WS_HOSTNAME || 'localhost';
const WS_PORT = process.env.REACT_APP_WS_PORT || 2100;
const WS_PROTOCOL = process.env.REACT_APP_WS_PROTOCOL || 'ws';

/**
 * Establishes a WebSocket connection to the server
 * @param {function} handleMessage - Callback for handling message events
 * @param {string} projectId - The project ID to include in the connection URL
 * @param {object} config - Optional configuration to override environment settings
 */
export const connectSocket = (
    handleMessage,
    projectId,
    config = {}
) => {
    // Allow runtime override of configuration
    const hostname = config.hostname || WS_HOSTNAME;
    const port = config.port || WS_PORT;
    const protocol = config.protocol || WS_PROTOCOL;

    // Use provided projectId or default
    const finalProjectId = 'research_1';
    const userId = 'admin'; // Simple user ID generation

    // Construct WebSocket URL
    const wsUrl = `${protocol}://${hostname}:${port}/ws/orchestrate?app-id=${finalProjectId}&user-id=${userId}`;

    socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
        console.log('Connected to WebSocket server:', wsUrl);
    });

    socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket server');
        sessionId = null;
    });

    socket.addEventListener('message', (event) => {
        try {
            const parsedData = JSON.parse(event.data);

            // Handle session ID setup
            if (parsedData.type === 'json' && parsedData.data && parsedData.data.sessionId !== undefined) {
                sessionId = parsedData.data.sessionId;
                console.log('Session ID set:', sessionId);
            } else {
                // Pass all messages to the handler for processing
                handleMessage(parsedData);
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });    // Add error handling
    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });
};

export const setSessionId = (id) => {
    console.log('Setting session ID:', id);
    sessionId = id;
};

export const getSessionId = () => {
    return sessionId;
};

export const sendMessage = (message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open');
        return false;
    }

    const messagePayload = {
        sessionId: sessionId,
        userQuery: message,
    };

    socket.send(JSON.stringify(messagePayload));
    return true;
};

export const checkWebsocketConnection = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket is open');
        return true;
    } else {
        console.log('WebSocket is not open. Ready state:', socket?.readyState);
        return false;
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.close();
    }
    sessionId = null;
};

/**
 * Save the project ID to localStorage for WebSocket connections
 * @param {string} projectId - The project ID to store
 */
export const saveProjectId = (projectId) => {
    if (projectId) {
        localStorage.setItem('montar-chat-project-id', projectId);
        console.log('Project ID saved to localStorage:', projectId);
    }
};

/**
 * Get the project ID from localStorage
 * @returns {string|null} - The stored project ID or null
 */
export const getProjectId = () => {
    return localStorage.getItem('montar-chat-project-id');
};