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
  const [barangay, setBarangays] = useState('');
  const [city, setCities] = useState(''); 
  const [street, setStreets] = useState('');
  const [town, setTowns] = useState('');


  const handleRadioChange =(event) =>{
    setSelectedValue(event.target.value);
  }







  const handleCreateAccount = async () => {
  if(password ===password1){
    if(!email.endsWith('@gmail.com')|| name ===''||contact.length<11|| contact.length>11 || age.length>2)
    {
      toast.error('Invalid Account make sure you check the email, contact, age and adress if correct!', 
      {position: toast.POSITION.TOP_CENTER})
  }else{
    try {
      setError(null);
      const res = await auth.createUserWithEmailAndPassword(email, password)
          const user = res.user;  
         user.sendEmailVerification();

           await firestore.collection("user").add({
            uid: user.uid,
            Email:user.email,
            Name: name,
            Contact:contact,
            City:city,
            Town:town,
            Age:age,
            Gender:selectedValue,
            Photo:"",
            verified:false,
          })

          toast.success('Successfully Created Account, Verified your email before Logging in !', 
          {position: toast.POSITION.TOP_CENTER})
          setTimeout(() => navigate("/"), 2000);

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
            <label for="email">Email or phone</label>
        </div>
        <div class="login_input-box">
            <input type="text" class="login_input-field" id="name" autocomplete="off" value = {name} required onChange = {(e) =>setName(e.target.value) } />
            <label for="name">Full Name</label>
        </div>
        <div class="login_input-box">
            <input type="number" class="login_input-field" id="contact" autocomplete="off" value = {contact} required onChange = {(e) =>setContact(e.target.value) } />
            <label for="contact">Contact No</label>
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

<div class="row g-3">
            <div class="col-md-6"  >
              <label for="inputEmail4" class="login_input-field">Town</label>
              <input type="text" class="form-control" id="inputAddress"style ={{color:"orange"}} value={town} onChange={(e)=> setTowns(e.target.value)} /> 
            </div>
            <div class="col-md-6">
              <label for="inputCity"class="login_input-field">Province</label>
              <input type="text" class="form-control" id="inputCity"style ={{color:"orange"}} value={city} onChange={(e)=> setCities(e.target.value)} />
            </div>
            </div>
            <br />
        <div class="login_input-box">
            <input type="password" class="login_input-field" id="password1" autocomplete="off"  required onChange = {(e) => setPassword1(e.target.value) }/>
            <label for="password1">Password</label>
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