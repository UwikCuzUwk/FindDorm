import React,{useEffect, useState} from 'react'
import firebase from 'firebase/compat/app'
import LandlordNavbar from '../Navbar/LandlordNavbar';
import { firestore } from '../../../Database/Database';
import { parse, utcToZonedTime, format } from 'date-fns-tz';

function LandLordReport() {
  const [uid, setUid] = useState(null);
  const [landlordDocument, setLandlordDocument] = useState(null);
  const [roomCount, setRoomCount] = useState(null);
  const [inquestCount, setInquiryCount] = useState(null);
  const [accepted, setAccepted] = useState(null); 
 const [pending, setPending] = useState(null);
 const [pending1, setPending1] = useState(null);
const [paid, setPaid] = useState(null);
const [selectedDate, setSelectedDate] = useState(null);
const [monthlyIncome, setMonthlyIncome] = useState(0);
const [userDatas, setUserDatas] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);

    
    useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in; get their UID
          const userUid = user.uid;
          setUid(userUid);
        } else {
          // No user is signed in; set UID to null or take appropriate action
          setUid(null);
        }
      });
    }
    , []);
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await firestore.collection('userPayment').where('Landlord', '==', uid).where('Status', '==', 'Paid').get();
          let total = 0;
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseInt(data.Price)
          });
  
          setTotalPrice(total);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);



   const roomRef = firebase.firestore().collection('landlordData');
   roomRef
   .where('LandLord','==',uid)
   .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
     setRoomCount(count);
   })
   const inquiredRef1 = firebase.firestore().collection('userBooking');
  inquiredRef1
  .where('Status','==','Accept')
  .where('LandLord','==',uid)
  .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setAccepted(count)
  })
  const inquiredRef2 = firebase.firestore().collection('userBooking');
  inquiredRef2
  .where('Status','==','Pending')
  .where('LandLord','==',uid)
  .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setPending(count)
  })
  const inquiredRef3 = firebase.firestore().collection('userPayment');
  inquiredRef3
  .where('Status','==','Paid')
  .where('Landlord','==',uid)
  .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setPaid(count)
  })
  const inquiredRef4 = firebase.firestore().collection('userPayment');
  inquiredRef4
  .where('Status','==','Not Paid')
  .where('Landlord','==',uid)
  .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setPending1(count)
  })


 
  
  


  






  return (
   <>
  <LandlordNavbar />
<br />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<div class="container-fluid">

<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Report</h1>
</div>

<div class="row">
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold  text-uppercase mb-1" style={{color:"blue"}}>
                            Room (My Room)</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{roomCount} Room</div>
                    </div>
                    <div class="col-auto">
                    <i class="6rem material-icons">airline_seat_individual_suite</i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold  text-uppercase mb-1" style={{color:"blue"}}>
                            Total Inquired (Pending/Accept)</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"red"}}>{accepted}     <i class="6rem material-icons">streetview</i>Accepted</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{pending}     <i class="6rem material-icons">streetview</i>Pending</div>
                    </div>
                    <div class="col-auto">
                    <i class="6rem material-icons">turned_in</i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold  text-uppercase mb-1" style={{color:"blue"}}>
                            Payment(Paid/Pending)</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"red"}}>{paid}     <i class="6rem material-icons">attach_money</i>Paid</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{pending1}     <i class="6rem material-icons">streetview</i>Pending</div>
                    </div>
                    <div class="col-auto">
                    <i class="6rem material-icons">attach_money</i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold  text-uppercase mb-1" style={{color:"blue"}}>
                            Income(Monthly)</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"red"}}>{totalPrice}  <i class="6rem material-icons">attach_money</i></div>
                          
                    </div>
                    <div class="col-auto">
                    <i class="6rem material-icons">attach_money</i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
   </>
  )
}

export default LandLordReport