import Feed from './Feed';
import './Feeds.css'
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from '../../context/Posts';


const Feeds = ({id}) => {
   
   const {posts,dispatch} = useContext(PostContext)
   const {currentUser} = useContext(AuthContext)
  
  useEffect(()=>{
     const getTimeLinePosts=async()=>{
        try {
          const {data} = await axios.get(id? `/api/posts/userposts/all/${id}` : `/api/posts/timeline/all/${currentUser._id}`)
           dispatch({type:"SET_POSTS",payload:data})
        } catch (error) {
          alert(error.response.data.message)
        }

     }
     getTimeLinePosts()
  },[currentUser._id,id,dispatch])
    return ( 
       <div className="feeds">
          {
           posts && posts.map(post=><Feed key={post._id} feed={post} postId={post._id}/>)
          }
       </div>
     );
}
 
export default Feeds;