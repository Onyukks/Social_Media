import './Friends.css'
import Friend from "../../components/Friends/Friends";
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import FriendRequest from '../../components/FriendRequest/FriendRequest';
import Messages from '../../components/Messages/Messages';

const Friends = () => {
  const [friends,setfriends] = useState([])
  const {currentUser} = useContext(AuthContext)
  const [showfriends,setShowfriends] = useState(true)
  const [showfriendRequests,setShowfriendRequests] = useState(false)
  const [showOnlinefriends,setShowOnlinefriends] = useState(false)

  useEffect(()=>{
    const getFriends = async()=>{
        const {data} = await axios.get(`/api/friends/${currentUser._id}`)
        setfriends(data)
    }
    getFriends()
},[currentUser._id])
    return ( 
        <>
          <div className="headings">
            <h4 className="header" onClick={()=>{
               setShowfriends(true)
               setShowfriendRequests(false)
               setShowOnlinefriends(false)
            }}>Friends</h4>
            <h4 className="header" onClick={()=>{
               setShowfriends(false)
               setShowfriendRequests(true)
               setShowOnlinefriends(false)
            }}>Friend Requests</h4>
            <h4 className="header" onClick={()=>{
               setShowfriends(false)
               setShowfriendRequests(false)
               setShowOnlinefriends(true)
            }}>Online Friends</h4>
          </div>
          
       {friends && friends.map(fren=> showfriends &&  <Friend key={fren._id} friend={fren}/> ) }
       {showfriendRequests && <FriendRequest />}
       {showOnlinefriends && <Messages />}
        </>
     );
}
 
export default Friends;