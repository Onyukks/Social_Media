import AddPost from "../../components/AddPost/AddPost";
import Feeds from "../../components/Feed/Feeds"

const Home = () => {
    return ( 
        <>
            <AddPost />
            <Feeds id={false}/>
        </>
     );
}
 
export default Home;