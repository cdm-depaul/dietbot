import React, { createContext, useReducer } from 'react';
import { childProps } from '../_components/interface';
import { Chat } from './../_components';
import { API } from '../_api/api';

const api = new API(new TextDecoder(), 'http://localhost:11434');

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
    dispatch({
      action: 'userQuery',
      value: [
        React.cloneElement(
          <Chat key={state.chatHistory.length} className="my-3">
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
          <Chat className="" key={state.chatHistory.length + 1}>
            <div>{}</div>
          </Chat>
        ),
      ],
    });
    let message = '';
    api.postData(
      'api/generate',
      JSON.stringify({ model: 'llama3.2', prompt: query }),
      (response: string) => {
        message += response;
        dispatch({
          action: 'llmResponse',
          value: [state.chatHistory.length + 1, message],
        });
      }
    );
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
