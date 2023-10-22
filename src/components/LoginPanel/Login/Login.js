import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import google from '../Image/google.png'
import logo from './../Image/LOGO1.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Login/Login.css'
import firebase from 'firebase/compat/app'
import{auth, firestore, googleProvider} from '../../Database/Database'
import LoginNavbar from './LoginNavbar/LoginNavbar';


function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);



const handleSignin = async() => { 
  setError(null);

  if(email ==="dormifind.admin@gmail.com" && password ==="dormifind.admin123"){
    toast.success('Successfully Log in!', 
    {position: toast.POSITION.TOP_CENTER})
    setTimeout(() => navigate("/admin_home"), 2000);
   }
 else{
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);  
    toast.success('Successfully Log in!', 
    {position: toast.POSITION.TOP_CENTER})
    setTimeout(() => navigate("/user_home"), 2000);
  } catch (error) {
    console.error('Error signing in:', error.message);
    if (error.code === 'auth/user-not-found') {
      toast.success('User not found. Please check your email or sign up.', 
      {position: toast.POSITION.TOP_CENTER})
    } else if (error.code === 'auth/wrong-password') {
      toast.success('Wrong password. Please check your password and try again.', 
      {position: toast.POSITION.TOP_CENTER})
    } else if (error.code === 'auth/invalid-email') {
      toast.success('Invalid email format. Please enter a valid email address.', 
      {position: toast.POSITION.TOP_CENTER})
    }else if(error.code ==='auth/invalid-login-credentials'){
      toast.error('Invalid Credentials Please check your email and password', 
        {position: toast.POSITION.TOP_CENTER})
    }
  }
 }
}
 const handlelandlordlogin =async()=>{
  navigate('/landlord_login')
 }
 const handleGoogle = async()=>{
  try{
    await auth.signInWithPopup(googleProvider)
    navigate("/user_home")
  }catch(error){
    console.log("Error Found!", error.message);
  }
 }

  return (
<>
<LoginNavbar />
<html lang="en" />
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
</head>
<body class= "loginbody">
    <div class="login_login-box">
        <div class="login_login-header">
        <div className='login_logo'>
               <img src={logo}></img>
            </div>  
            <p class= 'forgot_tittle'>Log-In</p>
        
        </div>
        <div class="login_input-box">
            <input type="text" class="login_input-field" id="email" autocomplete="of" value = {email} required onChange = {(e) =>setEmail(e.target.value) } />
            <label for="email">Email or phone</label>
        </div>
        <div class="login_input-box">
            <input type="password" class="login_input-field" id="password" autocomplete="off" value = {password} required onChange = {(e) => setPassword(e.target.value) }/>
            <label for="password">Password</label>
        </div>
        <div class="login_forgot">
            <section>
                <a href="/reset_password" class="login_forgot-link">Forgot password?</a>
            </section>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div class="login_input-box">
            <input type="submit" class="login_input-submit" onClick = {handleSignin} value="Sign In" />
        </div>
        <div class="login_middle-text">
            <hr />
            <p class="login_or-text">Or</p>
        </div>
        <div class="login_social-sign-in">
            <button class="login_input-google" onClick={handleGoogle} >
                 <img src={google} alt="" />
                 <p> <a>Sign In with Google</a></p>
            </button>
            <button class="login_input-twitter" onClick={handlelandlordlogin}>
                <img src={logo} alt="" />
            </button>
        </div>
        <div class="login_sign-up">
            <p>Don't have account <a href="/signup_page">Sign up</a></p>
        </div>
    </div>
</body>
< ToastContainer />
</>
  )
}

export default Login