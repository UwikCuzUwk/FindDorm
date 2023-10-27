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

function LandLordBooked() {
  const [userItem, setUserItems]= useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [user, setUser] = useState('');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptBookings, setAcceptBookings] = useState([]);
  const [userselect, setUserSelect] = useState('');

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

  const handleAccept =async(id)=>{
    const docRef = firestore.collection('userBooking').doc(id);

    docRef.update({Status:'Accept'})
    .then(()=>{
      console.log("Document status updated")
    }).catch((error)=>{
      console.log("Error updating your Document", error)
    })
 
  }
const handleDecline= async(id)=>{
  const docRef = firestore.collection('userBooking').doc(id);

  docRef.update({Status:'Pending'})
  .then(()=>{
    console.log("Document updated")
  }).catch((error)=>{
    console.log("Error updating document", error)
  })
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
                    <td>{users.Status}</td>
                   <td>Cash</td>
          
             

                   <td>
                   <a href="#" class="delete"onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                  
                   <a href="#" class="accept"onClick={()=>handleAccept(users.id)} title="Accept" data-toggle="tooltip" style={{color:"green"}}> <i class="large material-icons">check</i></a>
                   <a href="#" class="decline"onClick={()=>handleDecline(users.id)} title="Decline" data-toggle="tooltip" style={{color:"red"}}> <i class="large material-icons">close</i></a>
                   <a href="#" class="view"onClick={()=>handleView(users.id)} title="View" data-toggle="tooltip" style={{color:"green"}}> <i class="large material-icons">visibility</i></a>
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
                <th>Contact </th>
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
                   <td>{users.Contact}</td>
                    <td>{users.Status}</td>
                   <td>Cash</td>
          
             

                   <td>
                   <a href="#" class="delete"onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                  
                   <a href="#" class="delete"onClick={()=>handleAccept(users.id)} title="Accept" data-toggle="tooltip" style={{color:"green"}}> <i class="large material-icons">check</i></a>
                   <a href="#" class="delete"onClick={()=>handleDecline(users.id)} title="Decline" data-toggle="tooltip" style={{color:"red"}}> <i class="large material-icons">close</i></a>
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
  
  </>
  )
}

export default LandLordBooked