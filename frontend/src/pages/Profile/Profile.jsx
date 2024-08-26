import UserProfile from "../../components/UserProfile/UserProfile";
import AddPost from "../../components/AddPost/AddPost"
import Feeds from "../../components/Feed/Feeds"
import { useParams } from "react-router-dom";

const Profile = () => {
   const {id} = useParams()
    return ( 
        <>
           <UserProfile />
           <AddPost/>
           <Feeds id={id} />
        </>
     );
}
 
export default Profile;