import React from 'react'
import '../../../Navbar/Navbar.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function UserNavbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
     
        Swal.fire({
            title: 'Are you sure?',
            text: "You back at Home page!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Log out!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Log out!',
                'Your Successfuly Log out.',
                'success',
                 navigate('/login_page')
              )
            }
          })
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };


  return (
<>
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <nav>
      <div class="nav_logo">Dormi<a class = "nav_logo1 ">Find </a></div>
      <input type="checkbox" id="click" />
      <label for="click" class="nav_menu-btn">
        <i class="fas fa-bars"></i>
      </label>
      <ul>
        <li><a class="" href="">Home</a></li>
        <li><a href="">About Us</a></li>
        <li><a href="">Booked</a></li>
        <li><a  class = "backtohome" onClick = {handleLogout}>Logout</a></li>
      </ul>
    </nav>
  </body>
</>
  )
}

