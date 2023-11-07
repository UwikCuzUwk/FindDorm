import React, {useState, useEffect} from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import {auth, firestore} from '../../../Database/Database'
import firebase from 'firebase/compat/app';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../Navbar/Footer';
import Swal from 'sweetalert2';

function UserBook() {
const navigate = useNavigate();
const [age, setAge] = useState('');
const [sex, setSex] = useState('');
const [message, setMessage] = useState('');
const {id} = useParams();
const [userName, setUserName] = useState('');
const [user, setCurrentUser]= useState('');
const [users, setUser] =useState([]);
const  [userItem, setUserItems] =useState([]);
const [userss, setUsers] =useState([]);
const [uidstorer, setUid] =useState('');
const [accepted, setAcceptedBooking] = useState();
const [userEmail, setUserEmail] = useState(''); 
const [userContact, setUserContact] = useState('')
const [userAddress, setUserAddress] = useState('')
const [userAge, setUserAge] = useState('')
const [userGender, setUserGender] = useState('')
const [userID, setuserID] = useState('');
const [bookingStatus, setBookingStatus] = useState(null);
const [available, setAvailable] = useState('');
const [street, setStreets] =useState('');
const [city, setCity] =useState('');
const [barangay, setBarangay] = useState('');
const [town, setTown] = useState('')


  const itemRef = firestore.collection('landlordData').doc(id);

  itemRef.get().then((doc)=>{
      if(doc.exists) {
          setUsers(doc.data());
          setAvailable(doc.data().Available);
      }else{
          console.log("Error Getting your data!")
      }
  },[id])

  useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserItems(user.uid);
        setuserID(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    const fetchUser = async(e) =>{
    const itemsRef = firestore.collection('landlordData')

    itemsRef.get().then((querySnapshot)=>{
      const data = [];
      querySnapshot.forEach((doc)=>{
       data.push({id:doc.id, ...doc.data()});
      })
      setUser(data)
    })

  }



const fetchUserItems = async (uid) => {
    try {
      const db = firebase.firestore();
      const itemsCollection = db.collection('landlordData');

      // Query items collection where the 'uid' field is equal to the current user's UID
      const querySnapshot = await itemsCollection.where('uid', '==', uid).get();

      // Extract data from the query snapshot
      const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      // Update the state with the user's items
     setUserItems(itemsData);
      console.log(itemsData)
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };
  
  fetchUser();
  fetchUserItems();


  return () => unsubscribe();

  }, []);


    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      const userCollection = firebase.firestore().collection('user');

      userCollection
        .where('uid', '==', currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setUserName(userData.Name);
            setUserEmail(userData.Email);
            setStreets(userData.Street);
            setBarangay(userData.Barangay);
            setTown(userData.Town);
            setCity(userData.City);
            setUserContact(userData.Contact)
            setUserAge(userData.Age)
            setUserGender(userData.Gender)
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
    const userBookingRef = firebase.firestore().collection('userBooking');
    userBookingRef
      .where('uid', '==', userID)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
      
          const bookingData = querySnapshot.docs[0].data();
          setBookingStatus(bookingData.Status);
        } else {
          // If no document is found, the user has not accepted
          setBookingStatus('Not Accepted'); 
        }
      })
      .catch((error) => {
        console.error('Error getting booking data:', error);
      });


const handleSubmit = async (e) => {
  e.preventDefault(); 
  const newAvailable = available - 1;
  if(bookingStatus!=='Accept'){
    if(newAvailable === 0){
      toast.error("No Room Available")
    }else{
   
          
          const db = firebase.firestore();
          const usersRef = db.collection('userBooking')
           usersRef.add({
            uid:user.uid,
            Email:userEmail,
            Name:userName,
            Age:userAge,
            Gender:userGender,
            Contact:userContact,
            OwnerEmail:userss.Email,  
            Street:street,
            Barangay:barangay,
            Town:town,
            City:city,
            Price:userss.Price,
            DormName:userss.Name,
            Owner:userss.LandlordName,
            LandLord:userss.LandLord,
            Status:'Pending',
            
          });
    toast.success('Booking Request Sent Successfully')
          Swal.fire('Saved!', '', 'success')
          navigate("/user_home")
    }
  }else{
    toast.error("You have already accepted the booking")
  }


   
    
         
};


  return (
<>
<br />
<UserNavbar />

<head>
<link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://unpkg.com/bs-brain@2.0.2/components/contacts/contact-1/assets/css/contact-1.css" />
        
</head>

<section class="bg-light py-3 py-md-5">
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
        <h2 class="mb-4 display-5 text-center">Inquire Now</h2>
        <p class="text-secondary mb-5 text-center">The best way to Book is to use our contact form below. Please fill out all of the required fields and we will get back to you as soon as possible.</p>
      </div>
    </div>
  </div>


  <div class="container">
    <div class="row justify-content-lg-center">
      <div class="col-12 col-lg-9">
        <div class="bg-white border rounded shadow-sm overflow-hidden">

          <form action="#!">
            <div class="row gy-4 gy-xl-5 p-4 p-xl-5">
              <div class="col-12">
                <div class="d-grid">
                <h2 class="mb-4 display-5 text-center">Information</h2>
                <div class="container mt-5">
        <form class="row g-3">
            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">Room Name</label>
              <input type="text" class="form-control" id="inputAddress"style ={{color:"orange"}} value={userss.Name} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Price</label>
              <input type="text" class="form-control" id="inputCity"style ={{color:"orange"}} value={userss.Price} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Owner Name</label>
              <input type="text" class="form-control" id="inputCity"style ={{color:"orange"}} value={userss.LandlordName} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Address</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"orange"}} value={userss.Street + " "+userss.Barangay + " " + userss.Town + " " + userss.City} />
            </div>
          
             
  

            <br />
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Name</label>
              <input type="text" class="form-control" id="inputCity"style = {{color:"blue"}} value={userName} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Contact</label>
              <input type="text" class="form-control" id="inputCity"style = {{color:"blue"}} value={userContact} />
            </div>   
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Street</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {street} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Barangay</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {barangay} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Town</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {town} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">City</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {city} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Gender</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {userGender} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Email</label>
              <input type="text" class="form-control" id="inputCity" style ={{color:"blue"}} value = {userEmail} />
            </div>
          </form>
          <hr />
          <br />
    </div>	
         


              
              
              
      
               
                  <button class="btn btn-primary btn-lg" type="submit" onClick={handleSubmit}>Inqure Now!</button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</section>
< ToastContainer />
<Footer />
</>
  )
}

export default UserBook