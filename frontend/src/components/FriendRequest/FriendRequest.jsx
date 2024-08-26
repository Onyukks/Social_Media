import './FriendRequest.css'
import {Link} from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { FriendRequestContext } from '../../context/FriendRequest'

const FriendRequest = () => {
   const {currentUser} = useContext(AuthContext)
   const {requests,dispatch} = useContext(FriendRequestContext)

   useEffect(()=>{
       const getFriendRequests = async()=>{
           const {data} = await axios.get(`/api/friends/friendrequest/${currentUser._id}`)
          dispatch({type:'SET_REQUEST',payload:data})
       }
       getFriendRequests()
   },[currentUser._id,dispatch])

  const handleAccept=async(id)=>{
     try {
      await axios.put('/api/friends/acceptrequest',{requestId:id})
      dispatch({type:'UPDATE_REQUEST',payload:id})
     } catch (error) {
      alert(error.respnse.data.message)
     }
  }
  const handleReject=async(id)=>{
    try {
      await axios.put('/api/friends/rejectfriend',{requestId:id})
       dispatch({type:'UPDATE_REQUEST',payload:id})
     } catch (error) {
      alert(error.respnse.data.message)
     }
  }

    return ( 
        <div className="friend-request">
        <div className="headings">
       
        </div>  
            {
              requests?.length >0? (
                 requests?.map(fren=>(
                    <div className="request">
                       <Link to={`/profile/${fren.requester._id}`}>
                           <div className="info" key={fren._id}>
                              <div className="user">
                                <img src={fren.requester.profilePic || '/Noprofile.jpeg'} alt="" />
                                <h5 style={{marginTop:"-14px"}}>{fren.requester.name}</h5>
                              </div>
                              <p style={{marginLeft:"43px", marginTop:"-14px"}}>{fren.mutualFriendsCount} mutual friends</p>
                           </div>
                       </Link>
                       <div className="action">
                         <button className="btn btn-primary" onClick={()=>handleAccept(fren._id)}>Accept</button>
                         <button className="btn btn-red" onClick={()=>handleReject(fren._id)}>Reject</button>
                       </div>
                    </div>
                ))
              ) : <p>No pending friend request</p>
            }
        </div>
     );
}
 
export default FriendRequest;