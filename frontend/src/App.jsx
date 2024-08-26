import './App.css';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import ChatBox from './pages/Chatbox/Chatbox';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import Left from './components/Left/Left';
import Right from './components/Right/Right';
import  { useContext,useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import FriendRequests from './pages/FriendRequests/FriendRequests';
import Friends from './pages/Friends/Friends';
import Conversations from './pages/Conversations/Conversations';

function App() {
   
    const {currentUser,checkAuth} = useContext(AuthContext)
  
    useEffect(()=>{
      checkAuth()
    },[])

    const applyDarkModeFromLocalStorage = () => {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.querySelector('body').classList.add('darkmode');
        }
    };

    useEffect(() => {
        applyDarkModeFromLocalStorage();
    }, []);

    const Layout = () => (
        <>
            <Navbar />
            <main>
                <Left />
                <div className="container">
                    <Outlet />
                </div>
                <Right />
            </main>
        </>
    );

    const router = createBrowserRouter([
        {
            path: "/",
            element: currentUser ? <Layout /> : <Navigate to='/login' />,
            children: [
                {
                    path: "/",
                    element: currentUser ? <Home /> : <Navigate to='/login' />
                },
                {
                    path: "/chatbox/:id",
                    element: currentUser ? <ChatBox /> : <Navigate to='/login' />
                },
                {
                    path: "/profile/:id",
                    element: currentUser ? <Profile /> : <Navigate to='/login' />
                },
                {
                    path: "/friendRequests",
                    element: currentUser ? <FriendRequests /> : <Navigate to='/login' />
                },
                {
                    path: "/friends",
                    element: currentUser ? <Friends /> : <Navigate to='/login' />
                },
                {
                    path: "/conversations",
                    element: currentUser ? <Conversations /> : <Navigate to='/login' />
                }
            ]
        },
        {
            path: "/login",
            element: !currentUser ? <Login /> : <Navigate to='/' />
        },
        {
            path: "/register",
            element: !currentUser ? <Register /> : <Navigate to='/' />
        }
    ]);
    
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
