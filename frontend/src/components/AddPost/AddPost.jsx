import './AddPost.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile, faTags } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { PostContext } from '../../context/Posts';
import UploadWidget from '../UploadWidjet/UploadWidget';

const AddPost = () => {
   const { currentUser } = useContext(AuthContext)
   const [desc, setDesc] = useState('')
   const [postImage,setPostImage] = useState('')
   const [postVideo,setPostVideo] = useState('')
   const { dispatch } = useContext(PostContext)

   const handleImageUpload = (url)=>{
    setPostVideo('')
    setPostImage(url)
   }
   const handleVideoUpload = (url)=>{
    setPostImage('')
    setPostVideo(url)
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!postImage && !postVideo && !desc) {
        alert("Please add a description, image, or video to your post.")
        return
     }
      const post = { userID: currentUser._id, desc ,img:postImage, video:postVideo}
      try { 
         const { data } = await axios.post("/api/posts", post)
          dispatch({ type: "ADD_POSTS", payload: data })
          setDesc('')
          setPostImage('')
          setPostVideo('')
      } catch (error) {
          console.log(error)
          alert("Could not create post")
          setDesc('')
          setPostImage('')
          setPostVideo('')
      }
   }

   return (
    <div className='postForm' onSubmit={handleSubmit}>
      <form className="user form-top">
        <img src={currentUser.profilePic || '/Noprofile.jpeg'} alt="" />
        <input type="text" placeholder="What's on your mind?" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button type='submit' className="btn btn-primary">Post</button>
      </form>
      <div className="post-categories">
        <UploadWidget
          uwConfig={{
            cloudName:`${import.meta.env.VITE_CLOUD_NAME}`,
            uploadPreset:`${import.meta.env.VITE_CLOUD_PRESET}`,
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "postImages",
          }}
          setState={handleImageUpload}
          condition="Upload Image"
          widgetId="image-widget"
        />
        <UploadWidget
          uwConfig={{
            cloudName:`${import.meta.env.VITE_CLOUD_NAME}`,
            uploadPreset:`${import.meta.env.VITE_CLOUD_PRESET}`,
            multiple: false,
            maxFileSize: 100000000,  // Adjust for larger video sizes
            folder: "postVideos",
            resourceType: "video",
          }}
          setState={handleVideoUpload}
          condition="Upload Video"
          widgetId="video-widget"
        />
        
        <span><FontAwesomeIcon icon={faTags}/>  Tag</span>
        <span><FontAwesomeIcon icon={faSmile}/>  Feelings</span>
      </div>
    </div>
  );
}

export default AddPost;
