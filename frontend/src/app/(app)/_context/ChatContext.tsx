import React, { createContext, useReducer } from 'react';
import { childProps } from '../_components/interface';
import { API } from '../_api/api';

const api = new API();

/* ---------- Types ---------- */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;           // Markdown/plain text
  pending?: boolean;         // assistant “typing”
  durationMs?: number;       // time to answer
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
  | { type: 'SET_AT'; index: number; patch: Partial<ChatMessage> };

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'NEW_CHAT':
      return { chatHistory: [] };

    case 'ADD_MESSAGES':
      return { chatHistory: [...state.chatHistory, ...action.value] };

    case 'SET_AT': {
      const next = [...state.chatHistory];
      if (next[action.index]) {
        next[action.index] = { ...next[action.index], ...action.patch };
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
    const userIndex = state.chatHistory.length;
    const assistantIndex = userIndex + 1;
    const startedAt = Date.now();

    // Append user + a pending assistant bubble
    dispatch({
      type: 'ADD_MESSAGES',
      value: [
        { role: 'user', content: query },
        { role: 'assistant', content: '...', pending: true },
      ],
    });

    try {
      const userId = 1;
      const responseData = await api.postJsonData<{ response: string }>(
        `chat/${userId}/ask`,
        { query }
      );

      const text = responseData?.response ?? "Sorry, I couldn't get a response.";
      const durationMs = Date.now() - startedAt;

      // ✅ Finalize the assistant message
      dispatch({
        type: 'SET_AT',
        index: assistantIndex,
        patch: { content: text, pending: false, durationMs },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch response';
      dispatch({
        type: 'SET_AT',
        index: assistantIndex,
        patch: { content: `Error: ${msg}`, pending: false },
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