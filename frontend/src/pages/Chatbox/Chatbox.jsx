import './Chatbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Message from '../../components/Message/Message';
import { SocketContext } from '../../context/SocketContext';
import { useNotificationStore } from '../../lib/notificationStore';


const ChatBox = () => {
   const { currentUser } = useContext(AuthContext);
   const [user, setUser] = useState({});
   const { id } = useParams();
   const { socket } = useContext(SocketContext);
   const [newMessage, setNewMessage] = useState('');
   const [conversation, setConversation] = useState({});
   const messageEndRef = useRef();
   const requestSent = useRef(false); 
   const decrease = useNotificationStore((state) => state.decrease);

   useEffect(() => {
      setConversation({});
      setNewMessage('');
      requestSent.current = false;
   }, [id]);

   useEffect(() => {
      const getUser = async () => {
         try {
            const { data } = await axios.get(`/api/users/${id}`);
            setUser(data);
         } catch (error) {
            alert(error.response.data.message);
         }
      };
      getUser();
   }, [id]);

   useEffect(() => {
      
      if (requestSent.current) return; // Prevent duplicate requests
      requestSent.current = true;
      const getConversation = async () => {
         try {
            const { data } = await axios.post(`/api/chat/addchat`, { receiverID: id });
            if (data && !data.seenBy.includes(currentUser._id)) {
               decrease();
            }
            setConversation(data);
         } catch (error) {
            console.error(error);
         }
      };
     getConversation()
   }, [id,currentUser._id,decrease]);

   useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [conversation]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (!newMessage) return;

         const { data } = await axios.post(`/api/messages/${conversation?._id}`,{text:newMessage});
         setConversation((prev) => ({ ...prev, messages: [...prev.messages, data] }));
         setNewMessage('');

         socket.emit('sendMessage', {
            receiverId: user._id,
            data
         });

      } catch (error) {
         alert(error.response.data.message);
         console.error(error);
      }
   };

   useEffect(() => {
      const read = async () => {
         try {
            await axios.put(`/api/chat/readchat/${conversation?._id}`, {});
         } catch (error) {
            console.error(error);
         }
      };

      if (conversation && socket) {
         socket.on("getMessage", (data) => {
            if (conversation._id === data.chatId) {
               setConversation((prev) => ({ ...prev, messages: [...prev.messages, data] }));
               read();
            }
         });
      }
      return () => {
         socket.off("getMessage");
      };
   }, [socket, conversation]);

   return (
      <div className="chatbox">
         <div className="chatboxWrapper">
            <div className="chatboxTop">
               <img src={user.profilePic || '/Noprofile.jpeg'} alt="" className='chatboImage' />
               <div className="user-name">
                  <h3>{user.name}</h3>
                  <h5 style={{ textAlign: "center" }}>@{user.username}</h5>
               </div>
            </div>
            <div className="chatboxMiddle">
               <div>
                  {conversation?.messages && conversation?.messages.map(message => <Message key={message._id} message={message} user={user} currentUser={currentUser} own={message.senderId === currentUser._id} />)}
               </div>
            </div>
            <div ref={messageEndRef}></div>
            <div className="chatboxBottom">
               <form onSubmit={handleSubmit}>
                  <input type="text" placeholder='Write Something' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <button className="btn btn-primary" type='submit'>
                     <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
};

export default ChatBox;

