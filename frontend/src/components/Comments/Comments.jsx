import { useContext,  useState } from 'react';
import './Comments.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'timeago.js';


const Comments = ({postId,comments,setComment}) => {
   const {currentUser} = useContext(AuthContext)
   const [commentText,setcommentText] = useState('')

   
   const handleSubmit=async(e)=>{
       e.preventDefault()
      try {
         const {data} = await axios.post(`/api/comments/${postId}`,{userId:currentUser._id, commentText})
         setComment(prevComments=>[data, ...prevComments])
         setcommentText('')
      } catch (error) {
         alert(error.response.data.message)
      }
   }

  
    return ( 
     <div className="comments">
        <div className="writebox">
           <form onSubmit={(e)=>handleSubmit(e)}>
               <div className="user">
               <img src={currentUser.profilePic || '/Noprofile.jpeg'} alt="" />
                  <input type="text" placeholder='Write a Comment' required value={commentText} onChange={(e)=>setcommentText(e.target.value)}/>
                  <button type='submit' className='btn btn-primary'>Send</button>
               </div>
           </form>
        </div>
        {
         comments && comments.map(comment=>(
                <Link to='/profile/id'>
                   <div className="user" key={comment._id}>
                      <img src={comment.user.profilePic || '/Noprofile.jpeg'} alt="" />
                      <div className='content'>
                        <h5>{comment.user.name}.  <small>{format(comment.createdAt)}</small></h5>
                        <p>{comment.commentText}</p>
                      </div>
                   </div>
                </Link>
            ))
        }
     </div>

     );
}
 
export default Comments;
