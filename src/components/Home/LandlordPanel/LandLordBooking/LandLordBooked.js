import React, { useEffect , useState} from 'react'
import { Button,Modal,Input } from 'react-bootstrap';
import {firestore} from '../../../Database/Database'
import firebase from 'firebase/compat/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { deleteDoc, doc } from 'firebase/firestore';
import LandlordNavbar from '../Navbar/LandlordNavbar';
import { Link } from 'react-router-dom';
import './LandLord.css'
import Footer from '../../../Navbar/Footer';

function LandLordBooked() {
  const [userItem, setUserItems]= useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [user, setUser] = useState('');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptBookings, setAcceptBookings] = useState([]);
  const [userselect, setUserSelect] = useState('');
  const [landlordData, setLandLordData] = useState('')
  const[available, setAvailable] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  


  useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserItems(user.uid);
        fetchPendingBookings(user.uid);
        fetchPendingBookings1(user.uid);
        LandlordData(user.uid);
    
      } else {
        setCurrentUser(null);
      }
    });

    const fetchUser = async(e) =>{
      try{
          const userDataCollection = await firestore.collection("landlordData").get();
          const userData = userDataCollection.docs.map((doc)=> doc.data());
          setUser(userData)

      }catch(error){
          console.error("Error fetching user", error.message);
      }

  }
  
const fetchUserItems = async (uid) => {
    try {
      const db = firebase.firestore();
      const itemsCollection = db.collection('userBooking');
      const querySnapshot = await itemsCollection.where('LandLord', '==', uid).get();
      const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserItems(itemsData);
     
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };
  const fetchPendingBookings = async (uid) => {
    try {
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('LandLord', '==', uid).where('Status', '==', 'Pending').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingBookings(pendingBookingData);
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  };
  const LandlordData = async (uid) => {
    try {
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('LandLord', '==', uid).get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLandLordData(pendingBookingData);
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  };
  const fetchPendingBookings1 = async (uid) => {
    try {
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('LandLord', '==', uid).where('Status', '==', 'Accept').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAcceptBookings(pendingBookingData);
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  };
 
 
  fetchPendingBookings1();
  fetchPendingBookings();
  fetchUser();

  return () => unsubscribe();

  }, []);

  const handleDelete =async(id)=>{
    try{
      const deleteVal =  doc(firestore,"userBooking",id)
      await deleteDoc(deleteVal)
      toast.success('Deleted!', 
      {position: toast.POSITION.TOP_CENTER})
     }catch(error){
      toast.error('Error !', error.message, 
      {position: toast.POSITION.TOP_CENTER})
     }
  }

  const handleAccept = async (id, LandLord) => {

    const landlordCollectionRef = firebase.firestore().collection('landlordData');
    const userBookingCollectionRef = firebase.firestore().collection('userBooking');
    
    try {
      const userBookingDoc = await userBookingCollectionRef.doc(id).get();
    
      if (!userBookingDoc.exists) {
        console.error("User booking not found.");
        return;
      }
    
      const userBookingData = userBookingDoc.data();
      const userBookingLandLord = userBookingData.LandLord;
      const userBookingName = userBookingData.DormName;
      const userName = userBookingData.Name;
      const userEmail = userBookingData.Email;
      const userID = userBookingData.uid;
      const price =userBookingData.Price;
    
    
      const querySnapshot = await landlordCollectionRef
        .where("Name", "==", userBookingName)
        .where("LandLord", "==",userBookingLandLord )
        .get();
    
      const updates = [];
      let availableRooms = 0; // Initialize available rooms counter
    
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Check if Available is greater than 0 before updating
        if (data.Available > 0) {
          const newCount = data.Available - 1;
          if (newCount === 0) {
            availableRooms = 0; // Set available rooms to 0
          } else {
            availableRooms = newCount; // Update available rooms counter
          }
          
          updates.push({
            docRef: landlordCollectionRef.doc(doc.id),
            data: { Available: newCount },
          });
        }
      });
    
      if (availableRooms > 0) {
        updates.push({
          docRef: userBookingCollectionRef.doc(id),
          data: { Status: 'Accept' },
        });
    
        await Promise.all(updates.map(({ docRef, data }) => docRef.update(data)),
        toast.success("Successfully Accepted", { delay: 1000 }));

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1.
        const nextBillingDate = new Date(currentDate);
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);
      
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
        // Add data to Firestore
        firestore.collection('userPayment').add({
          Name: userName,
          Email:userEmail,
          Landlord:userBookingLandLord,
          DormName:userBookingName,
          currentMonth: currentMonth,
          nextBillingDate: nextBillingDate,
          Status:"Not Paid",
          CurrentDate: timestamp,
          uid:userID,
          Price:price,
          totalPrice:0,
          Additional:0,
        });


      } else {
        toast.error("No available rooms for the user booking.");
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };
  
  
  

  
  
  
  
  
  
  
  
  
  
const handleDecline= async(id)=>{
  const landlordCollectionRef = firebase.firestore().collection('landlordData');
  const userBookingCollectionRef = firebase.firestore().collection('userBooking');
  
  try {
    const userBookingDoc = await userBookingCollectionRef.doc(id).get();
  
    if (!userBookingDoc.exists) {
      console.error("User booking not found.");
      return;
    }
  
    const userBookingData = userBookingDoc.data();
    const userBookingLandLord = userBookingData.LandLord;
    const userBookingName = userBookingData.DormName;
    const userName = userBookingData.Name;
    const userEmail = userBookingData.Email;
  
  
    const querySnapshot = await landlordCollectionRef
      .where("Name", "==", userBookingName)
      .where("LandLord", "==",userBookingLandLord )
      .get();
  
    const updates = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
     
      
        const newCount = data.Available + 1;

        updates.push({
          docRef: landlordCollectionRef.doc(doc.id),
          data: { Available: newCount },
        });
      
    });
  
      updates.push({
        docRef: userBookingCollectionRef.doc(id),
        data: { Status: 'Pending' },
      });
  
      await Promise.all(updates.map(({ docRef, data }) => docRef.update(data)),
      toast.success("Successfully Declined", { delay: 1000 }));
      
    
  } catch (error) {
    console.error("Error accepting booking:", error);
  }

}

const handleView =async(id) =>{
 handleShow(true)
}

const handlePayment = async(id)=>{
  <Link to = {`/landlord_payment/${id}`} />
}

  return (
  <>
  <LandlordNavbar />
  <div class="container ">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row ">

<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
    <form class="form-inline">
    
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2>Accept</h2></div>

  <div class="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">

 </div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Email </th>
                <th>Contact </th>
                <th>DormName </th>
                <th>Status </th>
                <th>Payment Cash </th>
             

                <th>Actions</th>
            </tr>
            {acceptBookings.map((users, index)=>{
                return(
              <tr key ={users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Email}</td>
                   <td>{users.Contact}</td>
                   <td>{users.DormName}</td>
                    <td>{users.Status}</td>
                   <td>Cash</td>
          
             

                   <td>
                   <a href="#" class="delete"onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                   <a href="#" class="decline"onClick={()=>handleDecline(users.id, users.LandLord)} title="Decline" data-toggle="tooltip" style={{color:"red"}}> <i class="large material-icons">close</i></a>
                   <Link to ={`/landlord_payment/${users.uid}`}>
                   <a href="#" class="delete"title="Payment" data-toggle="tooltip" style={{color:"orange"}}> <i class="large material-icons">payment</i></a>
                    </Link>
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Account </td>




        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  

</div>
</div>
<div class="container ">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row ">

<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
    <form class="form-inline">
    
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"red"}}><h2>Pending</h2></div>

  <div class="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">

 </div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Email </th>
                <th>Room </th>
                <th>Status </th>
      
                <th>Payment Cash </th>
             

                <th>Actions</th>
            </tr>
            {pendingBookings.map((users, index)=>{
                return(
              <tr key ={users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Email}</td>
                   <td>{users.DormName}</td>
                 
                    <td>{users.Status}</td>
                  
                   <td>Cash</td>
          
             

                   <td>
                   <a href="#" class="delete"onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                  
                   <a href="#" class="delete"onClick={()=>handleAccept(users.id, users.LandLord)} title="Accept" data-toggle="tooltip" style={{color:"green"}}> <i class="large material-icons">check</i></a>
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Account </td>




        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  

</div>
</div>
<Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
            <Modal.Body>
          <form>
           
          </form>
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
< ToastContainer />
  <Footer />
  </>
  )
}

export default LandLordBooked