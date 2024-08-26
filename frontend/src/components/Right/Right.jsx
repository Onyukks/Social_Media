import './Right.css'
import FriendRequest from "../FriendRequest/FriendRequest";
import Messages from "../Messages/Messages";
import {Link} from 'react-router-dom'

const Right = () => {
    return ( 
       <div className="rightBar">
          <div className="rightBar-container">
            <Messages />
            <Link to="/friendRequests"><h4 className='request-border'>Friend Requests</h4></Link>
            <FriendRequest />
          </div>
       </div>
     );
}
 
export default Right;