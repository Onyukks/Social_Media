import { Link } from 'react-router-dom';
import './Left.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Friends from '../../assets/icon/1.png';
import Groups from '../../assets/icon/2.png';
import Gallery from '../../assets/icon/5.png';
import Videos from '../../assets/icon/6.png';
import Messages from '../../assets/icon/7.png';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const Left = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`leftBar `}>
      <div className="left-container">
        <div className="menu">
          <Link to={`/profile/${currentUser._id}`}>
            <div className="user">
            <img src={currentUser.profilePic || '/Noprofile.jpeg'} alt="" />
              <h4>{currentUser.name}</h4>
            </div>
          </Link>
          <Link to="/friends">
            <div className="item">
              <img src={Friends} alt="" />
              <h4>Friends</h4>
            </div>
          </Link>
          <Link to="/">
            <div className="item">
              <img src={Groups} alt="" />
              <h4>Groups</h4>
            </div>
          </Link>
          <Link to="/friendRequests">
            <div className="item">
              <img src={Friends} alt="" />
              <h4>Friend Requests</h4>
            </div>
          </Link>
          <div className='link' onClick={handleLogout}>
            <div className="item">
              <FontAwesomeIcon icon={faSignOut} className='iconitem'/>
              <h4>Logout</h4>
            </div>
          </div>
        </div>
        <hr />
        <div className="menu">
          <h4 className='others'>Your Shortcuts</h4>
          <Link to="/">
            <div className="item">
              <img src={Gallery} alt="" />
              <h4>Gallery</h4>
            </div>
          </Link>
          <Link to="/">
            <div className="item">
              <img src={Videos} alt="" />
              <h4>Videos</h4>
            </div>
          </Link>
          <Link to="/conversations">
            <div className="item">
              <img src={Messages} alt="" />
              <h4>Messages</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Left;
