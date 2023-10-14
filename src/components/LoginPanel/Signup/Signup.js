import React, {useState} from 'react'
import './Signup.css'
import logo from '../../../Image/LOGO1.png'


function Signup() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, SetName] = useState('');
const [address, setAddress] = useState('');
const [phone, setPhone] = useState('');
const [gender, setGender] = useState('');
const [bday, setBday] = useState('');


  return (
<>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <section class="signup_container">
      <div className='login_logo'>
               <img src={logo}></img>
            </div> 
            <header class = 'signup_create'>Create an Account</header>
      <form action="#" class="signup_form"> 
        <div class="signup_input-box">
          <label>Full Name</label>
          <input type="text" placeholder="Enter full name" required />
        </div>
        <div class="signup_input-box">
          <label>Email Address</label>
          <input type="text" placeholder="Enter email address" required  value = {email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div class="signup_input-box">
          <label>Password</label>
          <input type="password" placeholder="Enter email address" value = {password} onChange={(e) => setPassword(e.target.value)}required />
        </div>
        <div class="signup_column">
          <div class="signup_input-box">
            <label>Phone Number</label>
            <input type="number" placeholder="Phone number" valae = {phone} onChange = {(e) => setGender(e.target.value)} required />
          </div>
          <div class="signup_input-box">
            <label>Birth Date</label>
            <input type="date" placeholder="Birth Date" required  value = {bday} onChange = {(e) => setBday(e.target.value)} />
          </div>
        </div>
        <div class="signup_gender-box">
          <h3>Gender</h3>
          <div class="signup_gender-option">
            <div class="signup_gender">
              <input type="radio" id="check-male" name="gender"  />
              <label for="signup_check-male">Male</label>
            </div>
            <div class="signup_gender">
              <input type="radio" id="check-female" name="gender" />
              <label for="signup_check-female">Female</label>
            </div>
          </div>
        </div>
        <div class="signup_input-box address">
          <label>Address</label>
          <input type="text" placeholder="Enter street address" value = {address} onChange = {(e) => setAddress(e.target.value)} required />
        </div>
        <div class="signup_input-box">
            <input type="submit" class="signup-submit"value="Register Account" />
        </div>
        <div class = "back">
          <a class = "backtologins" href = "/login">Back to Login</a>
        </div>
      </form>
    </section>
  </body>

</>
  )
}

export default Signup