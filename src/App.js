import React from 'react'
import {Route, Routes} from 'react-router-dom'
import ProtectedRoutes from './components/AuthContext/ProtectedRoutes'
import { AuthContextProvider } from './components/AuthContext/AuthContext'
import Login from './components/LoginPanel/Login/Login'
import Caccount from './components/LoginPanel/Caccount'
import Forgot from './components/LoginPanel/Forgot/Forgot'
import UserHome from './components/Home/UserPanel/UserHome/UserHome'
import LandlordLogin from './components/Home/LandlordPanel/Login/LandlordLogin'
import LandlordHome from './components/Home/LandlordPanel/Home/LandlordHome'
import Add from './components/Home/LandlordPanel/Add/Add'
import AdminHome from './components/Home/AdminPanel/Home/AdminHome'
import AdminAdduser from './components/Home/AdminPanel/AdminAddUser/AdminAdduser'
import UserView from './components/Home/UserPanel/UserView/UserView'
import Location from './components/Home/UserPanel/Location/Location'
import UserBook from './components/Home/UserPanel/Booking/UserBook'
import Booked from './components/Home/UserPanel/Booked/Booked'
import LandLordView from './components/Home/LandlordPanel/View/LandLordView'
import LandLordBooked from './components/Home/LandlordPanel/LandLordBooking/LandLordBooked'
import Home from './components/LoginPanel/Home/Home'
import Payment from './components/Home/LandlordPanel/Payment/Payment'
import UserPayment from './components/Home/UserPanel/Pending/UserPayment'
import UserDownload from './components/Home/UserPanel/UserDownload/UserDownload'
import UserProfile from './components/Home/UserPanel/UserPage/UserProfile'
import LandlordProfile from './components/Home/LandlordPanel/Profile/LandlordProfile'
import ActiveRoom from './components/Home/UserPanel/ActiveDorm/ActiveRoom'
import Alluser from './components/Home/AdminPanel/User/Alluser'
import Report from './components/Home/AdminPanel/Report/Report'
import LandLordReport from './components/Home/LandlordPanel/Report/LandLordReport'



function App() {
  return (
  <>
  <AuthContextProvider>  
  <Routes>
    <Route exact path = "/" element ={<Home />} />
    <Route exact path = "/login_page" element = {<Login />} />
      <Route exact path = "/signup_page" element = {<Caccount />} />
      <Route exact path = "/reset_password" element = {<Forgot /> } />
      <Route exact path = "/user_home" element = {<ProtectedRoutes><UserHome /></ProtectedRoutes>} />
      <Route exact path = "/landlord_login" element = {<LandlordLogin />} />
      <Route exact path = "/landlord_home" element = {<ProtectedRoutes><LandlordHome /></ProtectedRoutes>} />
      <Route exact path = "/landlord_add" element ={<ProtectedRoutes><Add /></ProtectedRoutes>} />
      <Route exact path = "/admin_home" element ={<AdminHome />} />
      <Route exact path = "/admin_add" element ={<AdminAdduser />} />
      <Route exact path = "/user_view/:id" element ={<ProtectedRoutes><UserView /></ProtectedRoutes>} />
      <Route exact path = "/user_location/:id" element = {<ProtectedRoutes><Location /></ProtectedRoutes>} />
      <Route exact path = "/user_booking/:id" element = {<ProtectedRoutes><UserBook /></ProtectedRoutes>} />
      <Route exact path = "/user_booked" element ={<ProtectedRoutes><Booked /></ProtectedRoutes>} />
      <Route exact path = "/landlord_view/:id" element ={<ProtectedRoutes><LandLordView /></ProtectedRoutes>} />
      <Route exact path = "/landlord_booked" element ={<ProtectedRoutes><LandLordBooked /></ProtectedRoutes>} />
      <Route exact path = "/landlord_payment/:id" element ={<ProtectedRoutes><Payment /></ProtectedRoutes>} />
      <Route exact path = "/user_payment/:id" element = {<ProtectedRoutes><UserPayment /></ProtectedRoutes>} />
      <Route exact path ="/user_download/:id" element = {<ProtectedRoutes><UserDownload /></ProtectedRoutes>} />
      <Route exact path = "/user_profile" element = {<ProtectedRoutes><UserProfile /></ProtectedRoutes>} /> 
      <Route exact path = "/landlord_profile" element = {<ProtectedRoutes><LandlordProfile /></ProtectedRoutes>} />
      <Route exact path = "/user_active" element = {<ProtectedRoutes><ActiveRoom /></ProtectedRoutes>} />
      <Route exact path = "/admin_user" element = {<Alluser />} />
      <Route exact path = "/admin_report" element = {<Report />} />
      <Route exact path = "/landlord_report" element = {<ProtectedRoutes><LandLordReport /></ProtectedRoutes>} />
      
  </Routes>
  </AuthContextProvider>
  </>
  )
}

export default App