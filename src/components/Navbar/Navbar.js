import React from 'react'
import './Navbar.css'
function Navbar() {
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
        <li><a class="" href="/">Home</a></li>
        <li><a href="/login_page">Login</a></li>
        <li><a href="/signup_page">Signup</a></li>
      </ul>
    </nav>
  </body>
</>
  )
}

export default Navbar