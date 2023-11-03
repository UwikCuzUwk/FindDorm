import React, {useState} from 'react'
import google from './Image/google.png'
import logo from './Image/LOGO1.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login/Login.css'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword,signInWithPopup } from '@firebase/auth';
import {auth, firestore } from '../Database/Database'
import {GoogleAuthProvider  } from 'firebase/auth'
import LoginNavbar from './Login/LoginNavbar/LoginNavbar';


function Caccount() {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [error, setError] = useState('');
  const [value,setValue] = useState('')
  const  [name,setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('')
  const provider = new GoogleAuthProvider();
  const [selectedValue, setSelectedValue] = useState('');
  const [age, setAge] = useState('');

  const handleRadioChange =(event) =>{
    setSelectedValue(event.target.value);
  }







  const handleCreateAccount = async () => {
  if(password ===password1){
    if(!email.endsWith('@gmail.com')|| name ===''||contact.length<11||address ==='' || contact.length>11 || age.length>2)
    {
      toast.error('Invalid Account make sure you check the email, contact, age and adress if correct!', 
      {position: toast.POSITION.TOP_CENTER})
  }else{
    try {
      setError(null);
      const res = await createUserWithEmailAndPassword(auth, email, password)
          const user = res.user;  


          await firestore.collection("user").add({
            uid: user.uid,
            Email:user.email,
            Name: name,
            Contact:contact,
            Address:address,
            Age:age,
            Gender:selectedValue,
            Photo:"",
          })

          toast.success('Successfully Created account!', 
          {position: toast.POSITION.TOP_CENTER})
          navigate('/')

    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format!', 
    {position: toast.POSITION.TOP_CENTER})
      } else if (error.code === 'auth/weak-password') {
        toast.error('Weak password, please choose a stronger password', 
    {position: toast.POSITION.TOP_CENTER})
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use, please choose a different email', 
    {position: toast.POSITION.TOP_CENTER})
 
      }
    }
  }
   
  }else{
    toast.error('Password did not match', 
    {position: toast.POSITION.TOP_CENTER})
  }
}
const handleGoogleSignUp = ()=>{
  signInWithPopup(auth,provider).then((data)=>{
    setValue(data.user.email)
    localStorage.setItem("email",data.user.email)
})
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
    <div class="create_login-box">
        <div class="login_login-header">
        <div className='login_logo'>
               <img src={logo}></img>
            </div>  
            <p class= 'forgot_tittle'>Create Account</p>
        
        </div>
        <div class="login_input-box ">
            <input type="text" class="login_input-field" id="email" autocomplete="off" value = {email} required onChange = {(e) =>setEmail(e.target.value) } />
            <label for="password">Email or phone</label>
        </div>
        <div class="login_input-box">
            <input type="text" class="login_input-field" id="name" autocomplete="off" value = {name} required onChange = {(e) =>setName(e.target.value) } />
            <label for="text">Full Name</label>
        </div>
        <div class="login_input-box">
            <input type="number" class="login_input-field" id="contact" autocomplete="off" value = {contact} required onChange = {(e) =>setContact(e.target.value) } />
            <label for="password">Contact No</label>
        </div>
        <div class="login_input-box">
            <input type="text" class="login_input-field" id="address" autocomplete="off" value = {address} required onChange = {(e) =>setAddress(e.target.value) } />
            <label for="password">Address</label>
        </div>


        <div class="d-flex flex-row">
  <div class="p-2">
  <div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="Male" checked = {selectedValue==='Male'} onChange={handleRadioChange} />
  <label class="form-check-label" for="flexRadioDefault1">Male</label>
</div>

<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="Female" checked = {selectedValue==='Female'} onChange={handleRadioChange} />
  <label class="form-check-label" for="flexRadioDefault2">Female</label>
</div> 
  </div>
</div>

<div class="login_input-box">
            <input type="number" class="login_input-field " id="age" autocomplete="off" value = {age} required onChange = {(e) =>setAge(e.target.value) } />
            <label for="password">Age</label>
        </div>








        <div class="login_input-box">
            <input type="password" class="login_input-field" id="password1" autocomplete="off"  required onChange = {(e) => setPassword1(e.target.value) }/>
            <label for="password">Password</label>
        </div>
        <div class="login_input-box">
            <input type="password" class="login_input-field" id="password" autocomplete="off"  required onChange = {(e) => setPassword(e.target.value) }/>
            <label for="password">Re Type Your password</label>
        </div>
        <div class="login_forgot">
         
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div class="login_input-box">
            <input type="submit" class="login_input-submit" onClick = {handleCreateAccount} value="Create Account" />
        </div>
        <div class="login_sign-up">
            <p>Already have account? <a href="/login_page">Back to Login</a></p>
        </div>
    </div>
</body>
<ToastContainer />
</>
  )
}

export default Caccount