import React from 'react'
import {Route, Routes} from 'react-router-dom'
import ProtectedRoutes from './components/AuthContext/ProtectedRoutes'
import { AuthContextProvider } from './components/AuthContext/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Login from './components/LoginPanel/Login/Login'
import Caccount from './components/LoginPanel/Caccount'
import Forgot from './components/LoginPanel/Forgot/Forgot'
import UserHome from './components/Home/UserPanel/UserHome/UserHome'
import LandlordLogin from './components/Home/LandlordPanel/Login/LandlordLogin'
import LandlordHome from './components/Home/LandlordPanel/Home/LandlordHome'
import Add from './components/Home/LandlordPanel/Add/Add'
import AdminHome from './components/Home/AdminPanel/Home/AdminHome'
import AdminAdduser from './components/Home/AdminPanel/AdminAddUser/AdminAdduser'


function App() {
  return (
  <>
  <AuthContextProvider>  
  <Routes>
    <Route exact path = "/" element = {<Navbar />} />
    <Route exact path = "/login_page" element = {<Login />} />
      <Route exact path = "/signup_page" element = {<Caccount />} />
      <Route exact path = "/reset_password" element = {<Forgot /> } />
      <Route exact path = "/user_home" element = {<ProtectedRoutes><UserHome /></ProtectedRoutes>} />
      <Route exact path = "/landlord_login" element = {<LandlordLogin />} />
      <Route exact path = "/landlord_home" element = {<ProtectedRoutes><LandlordHome /></ProtectedRoutes>} />
      <Route exact path = "/landlord_add" element ={<ProtectedRoutes><Add /></ProtectedRoutes>} />
      <Route exact path = "/admin_home" element ={<AdminHome />} />
      <Route exact path = "/admin_add" element ={<AdminAdduser />} />
  </Routes>
  </AuthContextProvider>
  </>
  )
}

export default App