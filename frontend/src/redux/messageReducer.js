const initialState = {
    messages: [],
    error: null,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
                error: null,
            };
        case 'SEND_MESSAGE_SUCCESS':
            return {
                ...state,
                error: null,
            };
        case 'SEND_MESSAGE_FAILURE':
            return {
                ...state,
                error: action.payload,
            };
        case 'CLEAR_MESSAGES':
            return {
                ...state,
                messages: [],
                error: null,
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload,
                error: null,
            }
        default:
            return state;
    }
};

export default messageReducer;