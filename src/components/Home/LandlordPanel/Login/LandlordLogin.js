import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../../LoginPanel/Image/LOGO1.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../LoginPanel/Login/Login.css'
import {auth, firestore} from '../../../Database/Database'
import LoginNavbar from '../../../LoginPanel/Login/LoginNavbar/LoginNavbar';

function LandlordLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);
const handleSignin =async(e)=>{
    e.preventDefault();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Check if the user has the "grade7" flag in Firestore
      if (user) {
        const userDoc = await firestore.collection('userAdmin').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData && userData.isAdmin === 'isAdmin') {
          toast.success('Successfully Log in!', 
          {position: toast.POSITION.TOP_CENTER})
          setTimeout(() =>   navigate('/landlord_home'), 2000);
       
        } else {
          toast.error('Youre not allowed here!', 
          {position: toast.POSITION.TOP_CENTER})
        }
      }
    } catch (error) {
      toast.error('Youre not allowed here!', 
      {position: toast.POSITION.TOP_CENTER})
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
    <body>
        <div class="login_login-box">
            <div class="login_login-header">
            <div className='login_logo'>
                   <img src={logo}></img>
                </div>  
                <p class= 'forgot_tittle'>LandLord</p>
            
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
            <div class="login_sign-upss">
            <p><a href="/login_page">Back to Login</a></p>
        </div>
        </div>
    </body>
    < ToastContainer />
    </>
  )
}

export default LandlordLogin