import React,{useEffect, useState} from 'react'
import firebase from 'firebase/compat/app'
import AdminNavbar from '../Navbar/AdminNavbar'

function Report() {
  const [documentCount, setDocumentCount] = useState(null);
  const [landlordDocument, setLandlordDocument] = useState(null);
  const [roomCount, setRoomCount] = useState(null);
  const [inquestCount, setInquiryCount] = useState(null);
  const [accepted, setAccepted] = useState(null); 
  useEffect(() => {


    const collectionRef = firebase.firestore().collection('user');

    // Use the .get() method to fetch the documents and count them
    collectionRef.get().then((querySnapshot) => {
      const count = querySnapshot.size; // Number of documents in the collection
      setDocumentCount(count);
    });
    const landlordRef = firebase.firestore().collection('userAdmin');

    // Use the .get() method to fetch the documents and count them
    landlordRef.get().then((querySnapshot) => {
      const count = querySnapshot.size; // Number of documents in the collection
      setLandlordDocument(count);
    });
    
   const roomRef = firebase.firestore().collection('landlordData');
   roomRef.get().then((querySnapshot)=>{
    const count = querySnapshot.size;
     setRoomCount(count);
   })

   const inquiredRef = firebase.firestore().collection('userBooking');
   inquiredRef.get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setInquiryCount(count);
   })

   const inquiredRef1 = firebase.firestore().collection('userBooking');
  inquiredRef1
  .where('Status','==','Accept')
  .get().then((querySnapshot)=>{
    const count = querySnapshot.size;
    setAccepted(count)
  })
  }, []);






  return (
   <>
   <AdminNavbar />
<br />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<div class="container-fluid">

<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Report</h1>
</div>

<div class="row">

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total User (Landlord/user)</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{documentCount} <i class="material-icons">supervisor_account</i>User</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800"style={{color:"blue"}}>{landlordDocument} <i class="material-icons">supervisor_account</i>LandLord</div>
                    </div>
                    <div class="col-auto">
                    <i class="material-icons">group</i>
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
                            Room (LandLord)</div>
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
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{inquestCount}     <i class="6rem material-icons">turned_in_not</i>Inquired</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800" style={{color:"orange"}}>{accepted}     <i class="6rem material-icons">streetview</i>Accepted</div>
                    </div>
                    <div class="col-auto">
                    <i class="6rem material-icons">turned_in</i>
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

export default Report