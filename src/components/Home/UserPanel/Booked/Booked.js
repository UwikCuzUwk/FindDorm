import React, { useEffect , useState} from 'react'
import { Button,Modal,Input } from 'react-bootstrap';
import UserNavbar from '../UserNavbar/UserNavbar';
import {firestore} from '../../../Database/Database'
import firebase from 'firebase/compat/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Footer from '../../../Navbar/Footer';
import { hi, id } from 'date-fns/locale';

function Booked() {
  const [userItem, setUserItems]= useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [user, setUser] = useState('');
  const [accept, setAcceptedBooking] = useState([]);
  const [pending, setPendingBooking] = useState([]);
  const [uidstorer, setUid] = useState('');
  const [dormName, setDormName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [available, setAvailable] = useState('')



  useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
        fetchUserItems(user.uid);
        getData(user.uid);
        getData1(user.uid)
        getPayment(user.uid)
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
      const querySnapshot = await itemsCollection.where('uid', '==', uid).get();
      const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      if (itemsData.length > 0) {
        const firstItem = itemsData[0];
        setDormName(firstItem.DormName);
        setUserItems(itemsData);
      } else {
   
      }
  
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };
  
  
  const getData = async(uid)=>{
    try {
   
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('uid', '==', uid).where('Status', '==', 'Accept').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAcceptedBooking(pendingBookingData);
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  }
  const getData1 = async(uid)=>{
    try {

      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('uid', '==', uid).where('Status', '==', 'Pending').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingBooking(pendingBookingData);
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  }
  const getPayment = async (uid) => {
    try {
      const collectionName = 'userPayment';
      const querySnapshot = await firebase.firestore().collection(collectionName).where('uid', '==', uid).where('DormName', '==', dormName).get();
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.log('Fetched payment data:', data);
  
      if (data.length === 0) {
        setPaymentStatus('No payments found');
        return;
      }
      const anyPaid = data.some((payment) => payment.Status === 'Paid');
  
      if (anyPaid) {
        setPaymentStatus('Paid');
      } else {
        setPaymentStatus('All payments are pending.');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus('Error fetching payment status');
    }
  };
  
  

  getPayment();
  fetchUserItems();
  fetchUser();
  getData();

  getData1();
  return () => unsubscribe();
 



  }, [dormName]);

  const trueAvailbale = available -1;
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
const handleLeave =async(DormName, uid)=>{
  const currentUser = firebase.auth().currentUser;
  const userBookingCollection = 'userBooking';
  const landlordDataCollection = 'landlordData';
 if(paymentStatus==='Paid'){
  try {
  
    const userBookingQuerySnapshot = await firebase.firestore().collection(userBookingCollection)
      .where('uid', '==', currentUser.uid)
      .where('DormName', '==', dormName)
      .get();

    if (userBookingQuerySnapshot.empty) {
      console.log('No matching documents found in userBooking.');
      return;
    }

    const userBookingUpdatePromises = userBookingQuerySnapshot.docs.map((doc) => {
      const docRef = firebase.firestore().collection(userBookingCollection).doc(doc.id);
      return docRef.update({ Status: 'Pending' });
    });

    await Promise.all(userBookingUpdatePromises);

    console.log('Status updated to Pending in userBooking successfully.');

    // Update 'Available' field in landlordData collection
    const landlordDataQuerySnapshot = await firebase.firestore().collection(landlordDataCollection)
      .where('Name', '==', dormName)
      .get();

    if (landlordDataQuerySnapshot.empty) {
      console.log('No matching documents found in landlordData.');
      return;
    }

    const landlordDataUpdatePromises = landlordDataQuerySnapshot.docs.map((doc) => {
      const docRef = firebase.firestore().collection(landlordDataCollection).doc(doc.id);
      const currentAvailable = doc.data().Available || 0;
      const updatedAvailable = currentAvailable + 1;
      return docRef.update({ Available: updatedAvailable });
    });

    await Promise.all(landlordDataUpdatePromises);

   toast.success('Available value updated successfully.');
  } catch (error) {
    console.error('Error updating status:', error);
  }
  
  
 }else{
toast.error('Settled first your Payment before leaving!')
 }

 
}



  return (
  <>
<UserNavbar/>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <div class="container">
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row">

<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
    <form class="form-inline">
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-center" style={{color:"green"}}><h2>Accepted Inquiry</h2></div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Email </th>
                <th>Room Name</th>
                <th>Owner Name</th>
                <th>Status </th>
                <th>Payment Cash </th>
             

                <th>Actions</th>
            </tr>
            {accept.map((users, index)=>{
                return(
              <tr key ={users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Email}</td>
                   <td>{users.Owner}</td>
                   <td>{users.Owner}</td>
                    <td>{users.Status}</td>
                   <td>Cash</td>
          
             

                   <td>
                 
      
                   <Link to ={`/user_payment/${users.uid}`}>
                   
                   <a href="#" class="delete"title="View Payment" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">payment</i></a>
                </Link>
                <a href="#" class="leave"onClick={()=>handleLeave(users.DormName, users.uid)} title="Leave" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">cancel</i></a>
                
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Accepted Inquire </td>




        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  
</div>
</div>
<div class="container">
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row ">
<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
    <form class="form-inline">
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-center" style={{color:"red"}}><h2>Pending Inquiry</h2></div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Email </th>
                <th>Owner Name</th>
          
                <th>Status </th>
                <th>Payment Cash </th>
             

                <th>Actions</th>
            </tr>
            {pending.map((users, index)=>{
                return(
              <tr key ={users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Email}</td>
                   <td>{users.Owner}</td>
             
                    <td>{users.Status}</td>
                   <td>Cash</td>
          
             

                   <td>
                   <a href="#" class="delete"onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                  
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Pending Inquiry </td>




        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  
</div>
</div>
< ToastContainer />
<Footer />
  </>
  )
}

export default Booked