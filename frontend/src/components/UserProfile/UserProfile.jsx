import { Link, useParams } from 'react-router-dom';
import './UserProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFeed, faMessage } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Update from '../Update/Update';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [userfriends, setUserfriends] = useState([]);
  const [userfriendRequests, setUserfriendRequests] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [text,setText] = useState('Send Friend Request')

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${id}`);
        const { data: friends } = await axios.get(`/api/friends/${id}`);
        const { data: friendRequest } = await axios.get(`/api/friends/friendrequest/${id}`);
        setUser(data);
        setUserfriends(friends);
        setUserfriendRequests(friendRequest);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getUser();
  }, [id]);

  // Determine conditions
  const isCurrentUser = id === currentUser._id;
  const isFriend = userfriends.some(fren => fren._id === currentUser._id);
  const isFriendRequestSent = userfriendRequests.some(fren => fren.requester._id === currentUser._id);
  const canSendFriendRequest = !isCurrentUser && !isFriend && !isFriendRequestSent;

  const handleSendRequest =async()=>{
      try {
        await axios.post( "/api/friends/sendfriendrequest",{
          requesterId: currentUser._id, recipientId:id
        })
        alert("Friend Request Sent Successfully")
        setText('Friend Request Sent')
      } catch (error) {
        alert(error.response.data.message)
      }
  }

  return (
    <div className="userProfile">
      <div className="cover-photos">
        <img src={user.coverPic || '/CoverPhotos.jpg'} alt="" />
      </div>
      <div className="profile-Info">
        <img src={user.profilePic || '/Noprofile.jpeg'} alt="" />
        <div className="user-name">
          <h3>{user.name}</h3>
          <h5>{`@${user.username}`}</h5>
        </div>
        <div className="other-info">
          <p>{user.email}</p>
        </div>
        <div className="profile-Button">
          {isCurrentUser && (
            <button className='btn btn-primary' onClick={() => setOpenUpdate(true)}>
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          )}
          {isFriend && (
          <Link to={`/chatbox/${user._id}`}>
            <button className='btn btn-primary'>
              <FontAwesomeIcon icon={faMessage} /> Message
            </button>
          </Link>
          )}
          {isFriendRequestSent && (
            <button className='btn btn-primary' disabled>
              <FontAwesomeIcon icon={faFeed} /> Friend Request Sent
            </button>
          )}
          {canSendFriendRequest && (
            <button className='btn btn-primary' onClick={handleSendRequest}>
              <FontAwesomeIcon icon={faFeed} />{text}
            </button>
          )}
        </div>
        <p className="bio">
          {user.desc}
        </p>
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
    </div>
  );
};

export default UserProfile;
