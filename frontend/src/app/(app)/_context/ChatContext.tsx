import React, { createContext, useReducer } from 'react';
import { childProps } from '../_components/interface';
import { API } from '../_api/api';

const api = new API();

/* ---------- Types ---------- */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;           // Markdown/plain text
}
interface ChatState {
  chatHistory: ChatMessage[];
}
interface ChatMethods extends ChatState {
  newChat: () => void;
  postQuery: (query: string) => void;
}

/* ---------- Context ---------- */
const chatContext = createContext<ChatMethods>({
  chatHistory: [],
  newChat: () => {},
  postQuery: (_: string) => {},
});

/* ---------- Reducer ---------- */
type Action =
  | { type: 'NEW_CHAT' }
  | { type: 'ADD_MESSAGES'; value: ChatMessage[] }
  | { type: 'SET_ASSISTANT_AT'; index: number; content: string };

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'NEW_CHAT':
      return { chatHistory: [] };

    case 'ADD_MESSAGES':
      return { chatHistory: [...state.chatHistory, ...action.value] };

    case 'SET_ASSISTANT_AT': {
      const next = [...state.chatHistory];
      if (next[action.index] && next[action.index].role === 'assistant') {
        next[action.index] = { ...next[action.index], content: action.content };
      }
      return { chatHistory: next };
    }

    default:
      return state;
  }
}

/* ---------- Provider ---------- */
export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, { chatHistory: [] });

  const postQuery = async (query: string) => {
    // index where we'll later place the assistant's response
    const userIndex = state.chatHistory.length;
    const assistantIndex = userIndex + 1;

    // Append user message and a placeholder assistant bubble
    dispatch({
      type: 'ADD_MESSAGES',
      value: [
        { role: 'user', content: query },
        { role: 'assistant', content: '...' },
      ],
    });

    try {
      const userId = 1;
      const requestBody = { query };
      const responseData = await api.postJsonData<{ response: string }>(
        `chat/${userId}/ask`,
        requestBody
      );

      const text =
        responseData?.response ??
        "Sorry, I couldn't get a response.";

      // Expecting Markdown/plain text here
      dispatch({ type: 'SET_ASSISTANT_AT', index: assistantIndex, content: text });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch response';
      dispatch({
        type: 'SET_ASSISTANT_AT',
        index: assistantIndex,
        content: `Error: ${msg}`,
      });
      console.error('Error posting query:', err);
    }
  };

  const newChat = () => dispatch({ type: 'NEW_CHAT' });

  return (
    <chatContext.Provider value={{ ...state, newChat, postQuery }}>
      {children}
    </chatContext.Provider>
  );
};

export default chatContext;
