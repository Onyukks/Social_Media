import { useState } from 'react';
import './Register.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Register = () => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [username,setUserName] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = async(e)=>{
    e.preventDefault()
   try {
    await axios.post("/api/auth/register",{name,email,username,password})
    alert("Registration successful. Please Login to proceed")
    navigate('/login')
   } catch (error) {
   alert(error.response.data.message)
   }
  } 

  return (
      <div className="register">
         <div className="card">
          <div className="left">
            <h2>OnySocial SignUp</h2>
            <p>Connect with friends, follow inspiring creators, and share your moments with the world. Join the community today!</p>
            <span>Already Signed Up?</span>
           <Link to="/login"><button className='btn btn-primary'>Login</button></Link>
          </div>
          <form className="right" onSubmit={(e)=>handleSubmit(e)}>
             <input type="text" required placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}/>
             <input type="text" required placeholder='Username' value={username} onChange={(e)=>setUserName(e.target.value)} />
             <input type="email" required placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
             <input type="password" required placeholder='Password'  minLength="8" value={password} onChange={(e)=>setPassword(e.target.value)}/>
             <button type='submit' className="btn">Register</button>
          </form>
        </div>
      </div>
      );
}
 
export default Register;