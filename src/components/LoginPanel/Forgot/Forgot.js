import React, {useState} from 'react'
import google from  '../Image/google.png'
import logo from '../Image/LOGO1.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from 'firebase/compat/app'

import '../Login/Login.css'
import { useNavigate } from 'react-router-dom';
import LoginNavbar from '../Login/LoginNavbar/LoginNavbar';
export default function Forgot() {
const [email, setEmail] = useState();
const [resetSent, setResetSent] = useState(false);
const [reemail, resetEmail] = useState();
const [success, setSuccess] = useState(null);
const [error, setError] = useState('');
const navigate = useNavigate();

const handleResetPassword = async () => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    setResetSent(true);
    toast.success('Check your Email for Verification!', 
    {position: toast.POSITION.TOP_CENTER})
    setTimeout(() =>  navigate('/login_page'), 2000);
   
  } catch (error) {
    setError(error.message);
    console.error('Error sending password reset email:', error.message);
  }
};


  return (
<>
<LoginNavbar />
<html lang="en" />
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="forgot-box">
        <div class="login_login-header">
        <div className='login_logo'>
               <img src={logo}></img>
        
            </div>  
            <p class= 'forgot_tittle'>Reset Password</p>
        
        </div>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div class="login_input-box">
            <input type="text" class="login_input-field" id="email" autocomplete="off" value = {email} required  onChange={(e) => setEmail(e.target.value)} />
            <label for="email">Email or phone</label>
        </div>
        <div class="login_input-box">
            <input type="submit" class="login_input-submit"  onClick = {handleResetPassword}value="Reset Password" />
            <div class="login_forgot">

            <a href = "/login_page" class= 'backtologin'>Back to Login</a>
        </div>
       
        </div>
      
    
        
    </div>
</body>
<ToastContainer />
</>
  )
}
