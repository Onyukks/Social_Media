import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faEnvelope, faHome, faSearch, faSignOut, faUser, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import DarkMode from '../DarkMode/DarkMode';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Search from '../Search/Search';
import Badge from '@mui/material/Badge'
import { FriendRequestContext } from '../../context/FriendRequest';
import {useNotificationStore} from '../../lib/notificationStore'


const Navbar = () => {
  const { currentUser,logout } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  
    if(currentUser) fetch();

  const {requests} = useContext(FriendRequestContext)
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef();
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchQuery(''); // Clear the search input
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/">
            <h3 className="logo">OnySocial</h3>
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to={`/profile/${currentUser._id}`}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <div className="nav-searchbar" onClick={() => setShowSearch(true)}>
            <FontAwesomeIcon icon={faSearch} />
            <input 
              type="search" 
              placeholder="Search..." 
              onFocus={() => setShowSearch(true)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
        <div className="nav-right">
          <Link to="/conversations">
            <Badge badgeContent={number} color='primary'>
                 <FontAwesomeIcon icon={faEnvelope}/>
           </Badge>
          </Link>
          <Link to="/friends">
          <Badge badgeContent={requests?.length} color='primary'>
                 <FontAwesomeIcon icon={faUserFriends}/>
           </Badge>
          </Link>
          <DarkMode />
      
            <FontAwesomeIcon icon={faSignOut} onClick={handleLogout}/>
         
          <div className="user">
            <img src={currentUser.profilePic || '/Noprofile.jpeg'} alt="" />
            <h4>{currentUser.username}</h4>
          </div>
        </div>
      </div>
      {showSearch && (
        <div className="search-container" ref={searchRef}>
          <Search setShowSearch={setShowSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
    </nav>
  );
}

export default Navbar;


