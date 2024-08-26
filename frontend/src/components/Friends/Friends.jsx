import './Friends.css'
import {Link} from 'react-router-dom'

const Friend = ({friend}) => {
       return ( 
        <div className="friend-request">               
                    <div className="request">
                       <Link to={`/profile/${friend._id}`}>
                           <div className="info">
                              <div className="user">
                                <img src={friend.profilePic || '/Noprofile.jpeg'} alt="" />
                                <h5 style={{marginTop:"-14px"}}>{friend.name}</h5>
                              </div>
                              <p style={{marginLeft:"43px", marginTop:"-14px"}}>{friend.mutualFriendsCount} mutual friends</p>
                           </div>
                       </Link>
                       <div className="action">
                        <Link to={`/chatbox/${friend._id}`}><button className="btn btn-primary">Message</button></Link>
                       </div>
                    </div>
        </div>
     );
}
 
export default Friend;