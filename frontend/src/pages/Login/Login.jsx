import { Link } from 'react-router-dom';
import './Login.css'
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const {login} = useContext(AuthContext)

  const handleSubmit = async(e)=>{
     e.preventDefault()
     try {
     await login({email,password})
     } catch (error) {
      alert(error.response.data.message)
     }
     
  }

  return (
      <div className="login">
         <div className="card">
          <div className="left">
            <h2>OnySocial</h2>
            <p>Welcome back! Log in to stay connected with your friends and discover new content from creators you love.</p>
            <span>Don't have an account?.</span>
           <Link to="/register"><button className='btn btn-primary'>Register</button></Link> 
          </div>
          <form className="right" onSubmit={(e)=>handleSubmit(e)}>
             <input type="text" required placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
             <input type="password"  placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
             <button type='submit' className="btn">Login</button>
          </form>
        </div>
      </div>
      );
}
 
export default Login;