import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, logout, receiveMessage, sendMessage, clearMessages, setMessages} from '../redux/actions';

function Dashboard() {
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const messages = useSelector(state => state.messages.messages);
    const ws = useRef(null);

    useEffect(() => {
        // Check for existing token in sessionStorage
        const storedToken = sessionStorage.getItem('token');
        if (storedToken && !token) {
            dispatch(login(storedToken));
        }

        // Clear messages when component mounts
        //dispatch(clearMessages());

        return () => {
            // Clear messages when component unmounts
            //dispatch(clearMessages());
        };
    }, []);

    useEffect(() => {
        if (token) {
            sessionStorage.setItem('token', token);
            connectWebSocket();
        } else {
            sessionStorage.removeItem('token');
            if (ws.current) {
                ws.current.close();
            }
        }
    }, [token]);

    const connectWebSocket = () => {
        ws.current = new WebSocket(`ws://localhost:8000/ws`);

        ws.current.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            ws.current.send(JSON.stringify({token}));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'auth_success':
                    setIsAuthenticated(true);
                    dispatch(receiveMessage("Connected to server"));
                    break;
                case 'history':
                    dispatch(setMessages(data.messages));
                    break;
                case 'new_message':
                    dispatch(receiveMessage(data.message));
                    break;
                case 'error':
                    console.error('WebSocket error:', data.message);
                    setIsAuthenticated(false);
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            setIsAuthenticated(false);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setIsAuthenticated(false);
        };
    };

    const handleLogout = () => {
        dispatch(logout());
        sessionStorage.removeItem('token');
        if (ws.current) {
            ws.current.close();
        }
        //dispatch(clearMessages());
    };

    const handleClearMessages = async () => {
        dispatch(clearMessages());
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && ws.current && isAuthenticated) {
            dispatch(sendMessage(inputMessage, ws.current));
            setInputMessage('');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <button onClick={handleClearMessages} className="clear-messages-button">Clear Messages</button>

            <div className="connection-status">
                Status: {isConnected ? (isAuthenticated ? 'Authenticated' : 'Connected') : 'Disconnected'}
            </div>
            <div className="messages-container">
                <h3>Messages:</h3>
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className="message-item">{msg}</li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field"
                />
                <button type="submit" className="submit-button" disabled={!isAuthenticated}>Send</button>
            </form>
        </div>
    );
}

export default Dashboard;
