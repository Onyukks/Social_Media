import './Message.css'
import {format} from 'timeago.js'


const Message = ({user,own,currentUser,message}) => {
    return ( 
        <div className={own? "chatmessage own":"chatmessage"}>
            <div className="chatmessageTop">
               {
                message.senderId===currentUser._id? <img className='chatmessageImg' src={currentUser.profilePic || '/Noprofile.jpeg'} alt="" />
                        :   <img className='chatmessageImg' src={user.profilePic || '/Noprofile.jpeg'} alt="" />
               } 
                <p className='chatmessageText'>{message.text}</p>
            </div>
            <div className="chatmessageBottom">{format(message.createdAt)}</div>
        </div>
     );
}
 
export default Message;