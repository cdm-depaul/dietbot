import React, { createContext, useReducer } from 'react';
import { childProps } from '../_components/interface';
import { Chat } from './../_components';
import { API } from '../_api/api';

const api = new API();

interface chatInterface {
  chatHistory: React.ReactNode[];
}

interface chatMethodsInterface extends chatInterface {
  newChat: () => void;
  postQuery: (query: string) => void;
}

const chatContext = createContext<chatMethodsInterface>({
  chatHistory: [],
  newChat: () => {},
  postQuery: (query: string) => {},
});

const chatReducer = (
  state: chatInterface,
  payload:
    | { action: 'newChat' }
    | { action: 'userQuery'; value: React.ReactNode[] }
    | { action: 'llmResponse'; value: [number, string] }
) => {
  switch (payload.action) {
    case 'llmResponse':
      return {
        ...state,
        chatHistory: state.chatHistory.map((chat, index) => {
          if (index === payload.value[0]) {
            return React.cloneElement(
              <Chat className="" key={payload.value[0]}>
                <div className="flex">
                  {/* <span className="w-3 h-3 mr-5 rounded-full border"></span> */}
                  <div
                    className="border-none rounded-xl whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: payload.value[1] }}
                  />
                  {/* {payload.value[1]}
                </div> */}
                </div>
              </Chat>
            );
          }
          return chat;
        }),
      };
    case 'newChat':
      return { ...state, chatHistory: [] };
    case 'userQuery':
      return {
        ...state,
        chatHistory: [...state.chatHistory, ...payload.value],
      };
    default:
      return state;
  }
};

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    chatHistory: [],
  });
  const postQuery = async (query: string) => {
    const userQueryIndex = state.chatHistory.length;
    const llmResponseIndex = userQueryIndex + 1;

    dispatch({
      action: 'userQuery',
      value: [
        React.cloneElement(
          <Chat key={userQueryIndex} className="my-3">
            <div className="flex justify-end">
              <span
                className="border rounded-xl p-1 px-3"
                style={{ maxWidth: '70%' }}
              >
                {query}
              </span>
            </div>
          </Chat>
        ),
        React.cloneElement(
          <Chat className="" key={llmResponseIndex}>
            <div>...</div> 
          </Chat>
        ),
      ],
    });

    try {
      const userId = 1; // Hardcoded user ID, replace later
      const requestBody = { query: query };
      const responseData = await api.postJsonData<{ response: string }>(
          `chat/${userId}/ask`, // URL relative to base API URL
          requestBody
      );
      
      if (responseData && responseData.response) {e
          dispatch({
              action: 'llmResponse',
              value: [llmResponseIndex, responseData.response]
          });
      } else {
           // Improper message handling
           dispatch({
              action: 'llmResponse',
              value: [llmResponseIndex, "Sorry, I couldn't get a response."]
          });
           console.error("Received empty or invalid response from backend:", responseData);
      }
    } catch (error) {
        console.error("Error posting query:", error);
        dispatch({
            action: 'llmResponse',
            value: [llmResponseIndex, `Error: ${error instanceof Error ? error.message : 'Failed to fetch response'}`]
        });
    }
  };

  const newChat = () => {
    dispatch({ action: 'newChat' });
  };
  return (
    <chatContext.Provider value={{ ...state, newChat, postQuery }}>
      {children}
    </chatContext.Provider>
  );
};

export default chatContext;
