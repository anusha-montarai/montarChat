import React from 'react';
import './Header.scss';

const Header = () => {
    return (
        <div className="chat-header">
            <div className="chat-project-info">
                <div className="chat-project-name">
                    <div className="chat-project-icon">💬</div>
                    <span>Montar Chat</span>
                </div>
            </div>
            <div className="header-actions">
                <div className="connection-status">
                    <div className="status-dot"></div>
                    <span className="status-text">Online</span>
                </div>
            </div>
        </div>
    );
};

export default Header;