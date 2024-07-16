// Auth Actions

export const loginSuccess = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    return {
        type: 'LOGIN_SUCCESS',
        payload: {token, user},
    }
};

export const loginFailure = (error) => ({
    type: 'LOGIN_FAILURE',
    payload: error,
});

export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return {
        type: 'LOGOUT',
    }
};

export const checkStoredAuth = () => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (token && user) {
    return loginSuccess(token, user);
  }
  return { type: 'AUTH_CHECK_COMPLETE' };
};
// Message Actions
export const receiveMessage = (message) => ({
    type: 'RECEIVE_MESSAGE',
    payload: message,
});

export const sendMessageSuccess = () => ({
    type: 'SEND_MESSAGE_SUCCESS',
});

export const sendMessageFailure = (error) => ({
    type: 'SEND_MESSAGE_FAILURE',
    payload: error,
});

// In your actions file
export const setMessages = (messages) => ({
    type: 'SET_MESSAGES',
    payload: messages,
});

export const clearMessages = () => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await fetch('http://localhost:8000/clear_messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            dispatch({ type: 'CLEAR_MESSAGES' });
        } else {
            console.error('Failed to clear messages');
        }
    } catch (error) {
        console.error('Error clearing messages:', error);
    }
};

// Thunk action creators
export const login = (username, password) => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': username,
                'password': password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(loginSuccess(data.access_token, {username}));
        } else {
            const error = await response.text();
            dispatch(loginFailure(error));
        }
    } catch (error) {
        dispatch(loginFailure('An error occurred during login.'));
    }
};

export const sendMessage = (message, websocket) => (dispatch) => {
    try {
        websocket.send(JSON.stringify({message}));
        dispatch(sendMessageSuccess());
    } catch (error) {
        dispatch(sendMessageFailure('Failed to send message.'));
    }
};