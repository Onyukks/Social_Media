import './Messages.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from "socket.io-client";

const Messages = () => {

    const { currentUser } = useContext(AuthContext);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const socket = useRef();

    useEffect(()=>{
       socket.current = io("http://localhost:5000");
    },[])
  

    useEffect(() => {
        const getFriends = async () => {
            try {
                const { data } = await axios.get(`/api/friends/${currentUser._id}`);
                setFriends(data);
            } catch (error) {
                alert(error.response.data.message);
            }
        };
        getFriends();
    }, [currentUser]);

    useEffect(() => {
        socket.current.emit("addUser", currentUser._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(users)
        });
      }, [currentUser]);
    

    useEffect(() => {
        const getOnlineFriends = () => {
            const onlineFriendsList = friends.filter(friend => onlineUsers.some(user => user.userId === friend._id));
            setOnlineFriends(onlineFriendsList);
        };
        getOnlineFriends();
    }, [friends, onlineUsers]);

    return ( 
        <div className="Message">
            <div className="message-top">
                <h4>Online Friends</h4>
                <FontAwesomeIcon icon={faEdit}/>
            </div>
            <div className="border-div"></div>
            {
               onlineFriends && onlineFriends.map(fren=>(
                    <Link to={`/chatbox/${fren._id}`}>
                       <div className="message" key={fren._id}>
                         <div className="user">
                         <img src={fren.profilePic || '/Noprofile.jpeg'} alt="" className='chatboImage' />
                            <div className="green-active"> </div>
                         </div>
                         <div className="message-body">
                            <h5>{fren.name}</h5>
                         </div>
                       </div>
                    </Link>
                ))
            }
        </div>
     );
}
 
export default Messages;