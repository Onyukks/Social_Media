import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthContextProvider} from '../src/context/AuthContext'
import { PostContextProvider } from './context/Posts';
import { FriendRequestContextProvider } from './context/FriendRequest';
import { SocketContextProvider } from './context/SocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <PostContextProvider>
      <FriendRequestContextProvider>
        <SocketContextProvider>
            <App />
        </SocketContextProvider>
      </FriendRequestContextProvider>
    </PostContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
