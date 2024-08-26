import { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import { Link } from 'react-router-dom';


const Search = ({ setShowSearch, searchQuery, setSearchQuery }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.length > 0) {
        const response = await axios.get(`/api/users/all/getusers`);
        const filteredResults = response.data.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      <button onClick={() => setShowSearch(false)} className="close-button">Close</button>
      {results.length > 0 && (
        <div className="search-results">
          {results.map(user => (
            <div key={user._id} className="search-result-item">
              <img src={user.profilePic || '/Noprofile.jpeg'} alt="" className="search-result-avatar" />
              <div className="search-result-info">
                <Link to={`/profile/${user._id}`} className="search-result-name">{user.name}</Link>
                <span className="search-result-username">@{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;


