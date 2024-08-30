import './Feeds.css'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faComment, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext, useEffect } from 'react';
import Comments from '../Comments/Comments';
import {format} from 'timeago.js'
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { PostContext } from '../../context/Posts';


const Feed = ({feed,postId}) => {

    const [openComment,setOpenComment] = useState(false)
    const commentHandler = ()=>{
        setOpenComment(!openComment)
    }

    const {currentUser} = useContext(AuthContext)
    const [comments,setComment] = useState([])
    const [likes, setLikes] = useState(feed.likes.length);
    const [isLiked, setIsLiked] = useState(feed.likes.includes(currentUser._id));
    const {dispatch} = useContext(PostContext)


    useEffect(()=>{
        const fetchComments = async()=>{
            try {
               const {data} = await axios.get(`/api/comments/${postId}`)
               setComment(data)
            } catch (error) {
               alert(error.response.data.message)
            }
        }
   
        fetchComments()
   
      },[postId])

      const handleLike =async()=>{
             await axios.put(`/api/posts/${feed._id}/likes`,{userID:currentUser._id})
             setLikes(prev=>isLiked? prev-1:prev+1)
             setIsLiked(!isLiked);
      }
      const handleDelete = async(id)=>{
          try {
            await axios.delete(`/api/posts/${id}`)
            dispatch({type:"DELETE_POSTS",payload:id})
          } catch (error) {
            alert("Could not delete post")
          }
      }
   

    return (
       <div className="feed">
            <div className="top-content">
                <Link to={`/profile/${feed.userID._id}`}>
                     <div className="user">
                        <img src={feed.userID.profilePic || '/Noprofile.jpeg'} alt="" />
                        <div>
                           <h5>{feed.userID.name}</h5>
                           <small>{format(feed.createdAt)}</small>
                        </div>
                     </div>
                </Link>
          { currentUser._id === feed.userID._id &&  <span> <FontAwesomeIcon icon={faTrash} style={{marginLeft:"10px"}} onClick={()=>handleDelete(feed._id)}/></span> }
            
            </div>
            <div className="mid-content">
                <p>{feed.desc}</p>
              {feed.img?  <img src={feed.img} alt="" /> : ""}
                {feed.video ? <video src={feed.video} controls /> : null}
            </div>
            <div className="bottom-content">
                <div className="action-item">
                    <span><FontAwesomeIcon icon={faHeart} onClick={handleLike}
                 className={isLiked ? 'like' : ''}/> {likes} likes
                     </span>
                </div>
                <div className="action-item">
                    <span><FontAwesomeIcon icon={faComment} onClick={commentHandler}/> {comments.length} comments</span>
                </div>
            </div>
            {openComment && <Comments postId={feed._id} comments={comments} setComment={setComment}/>}
       </div>
      );
}
 
export default Feed;