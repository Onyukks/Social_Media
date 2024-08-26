import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";


const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const { data } = await axios.get(`/api/chat/allchats`);
                console.log(data)
                setConversations(data);
            } catch (error) {
                alert(error.response?.data?.message || "An error occurred");
            }
        };
        
        getConversations();
    }, [currentUser]);

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };

    return (
        <>
        <div className="Message">
            <div className="message-top">
                <h4>Conversations</h4>
            </div>
            <div className="border-div"></div>
            {conversations?.map((conversation) => (
                <Link to={`/chatbox/${conversation?.receiver?._id}`} key={conversation._id}>
                    <div className="message">
                        <div className="user">
                            <img
                                src={conversation?.receiver.profilePic || '/Noprofile.jpeg'}
                                alt=""
                                className='chatboImage'
                            />
                        </div>
                        <div className="message-body">
                            <h5>{conversation?.receiver?.name}</h5>
                            <p>
                                {conversation?.lastMessage?
                                       `${truncateText(conversation.lastMessage, 30)}`
                                       :  "No messages yet"}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </>
    );
};

export default Conversations;

