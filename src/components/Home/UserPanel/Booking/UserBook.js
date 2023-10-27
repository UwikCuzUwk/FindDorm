import React, {useState, useEffect} from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import {auth, firestore} from '../../../Database/Database'
import firebase from 'firebase/compat/app';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserBook() {

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



  const itemRef = firestore.collection('landlordData').doc(id);

  itemRef.get().then((doc)=>{
      if(doc.exists) {
          setUsers(doc.data());
      }else{
          console.log("Error Getting your data!")
      }
  },[id])

  useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserItems(user.uid);
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

  useEffect(() => {
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
            setUserAddress(userData.Address);
            setUserContact(userData.Contact)
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);




const handleSubmit = async (e) => {
  e.preventDefault();


  const user = firebase.auth().currentUser;

  if (user) {

          const db = firebase.firestore();
          const usersRef = db.collection('userBooking')
           usersRef.add({
            uid:user.uid,
            Email:userEmail,
            Name:userName,
            Age:age,
            Contact:userContact,
            Address:userAddress,
            DormName:userss.Name,
            Owner:userss.LandlordName,
            LandLord:userss.LandLord,
            Status:'Pending',
            
          });
 
          setAge('');
          setSex('');
    toast.success('Booking Request Sent Successfully')
      
        }
};


  return (
<>
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
        <hr class="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row justify-content-lg-center">
      <div class="col-12 col-lg-9">
        <div class="bg-white border rounded shadow-sm overflow-hidden">

          <form action="#!">
            <div class="row gy-4 gy-xl-5 p-4 p-xl-5">
 
              <div class="col-12 col-md-6">
                <label for="phone" class="form-label">Age</label>
                <div class="input-group">
                  <input type="tel" class="form-control" id="age" name="age" value={age} onChange={(e)=>setAge(e.target.value)} />
                </div>
              </div>

              <div class="col-12 col-md-6">
                <label for="phone" class="form-label">Sex</label>
                <div class="input-group">
                  <input type="tel" class="form-control" id="sex" name="sex" value= {sex} onChange ={(e) =>setSex(e.target.value)} />
                </div>
              </div>
              <div class="col-12">
                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit" onClick={handleSubmit}>Submit</button>
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
</>
  )
}

export default UserBook