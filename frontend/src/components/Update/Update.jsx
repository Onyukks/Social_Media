import './Update.css'
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import UploadWidget from '../UploadWidjet/UploadWidget';

const Update = ({ setOpenUpdate, user }) => {

  const [email,setEmail] = useState(user.email)
  const [password,setPassword] = useState('')
  const [city,setCity] = useState(user.city)
  const [name,setName] = useState(user.name)
  const [desc,setDesc] = useState(user.desc)
  const [username,setUsername] = useState(user.username)
  const [profileImage,setProfileImage] = useState(user.profilePic)
  const [coverImage,setCoverImage] = useState(user.coverPic)
  const {currentUser,updateUser} = useContext(AuthContext)
  
  const handleClick = async (e) => {
    e.preventDefault();
    const newdets = {
      userID: currentUser._id,
      email,
      password,
      city,
      name,
      desc,
      username,
      profilePic:profileImage,
      coverPic:coverImage 
    };
    try {
     const {data} = await axios.put(`/api/users/${user._id}`, newdets);
      alert("Profile updated successfully");
      updateUser(data)
      setOpenUpdate(false)
    } catch (error) {
      alert('Could not update profile');
    }
  };

  return (
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setOpenUpdate(false)}>
        &times;
      </span>
      <h1>Update Your Profile</h1>
      <div className="profile-images">
                <UploadWidget uwConfig={{
           cloudName:`${import.meta.env.VITE_CLOUD_NAME}`,
           uploadPreset:`${import.meta.env.VITE_CLOUD_PRESET}`,
          multiple:false,
          maxImageFileSize:2000000,
          folder:"avatars",
        }}
        setState={setProfileImage}
        condition={"Upload Profile Image"}
        widgetId="profile_upload_widget"
        />
                <UploadWidget uwConfig={{
            cloudName:`${import.meta.env.VITE_CLOUD_NAME}`,
            uploadPreset:`${import.meta.env.VITE_CLOUD_PRESET}`,
          multiple:false,
          maxImageFileSize:2000000,
          folder:"coverAvatars"
        }}
        setState={setCoverImage}
        condition={"Upload Cover Image"}
           widgetId="cover_upload_widget"
        />
        </div>
      <form onSubmit={handleClick}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={email}/>
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <label>Name</label>
        <input type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder={name}/>
        <label>Country / City</label>
        <input type="text" name="city" value={city} onChange={(e)=>setCity(e.target.value)} placeholder={city}/>
        <label>Username</label>
        <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder={username}/>
        <label>Bio</label>
        <input type="text" name="bio" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder={desc}/>
        <button type='submit'>Update</button>
      </form>
    </div>
  </div>
  );
};

export default Update;