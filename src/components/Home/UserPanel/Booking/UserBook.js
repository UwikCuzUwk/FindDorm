import React, {useState, useEffect} from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import {auth, firestore} from '../../../Database/Database'
import firebase from 'firebase/compat/app';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserBook() {
const [name, setName] = useState('');
const [email,setEmail] = useState('');
const [contact, setContact] = useState('');
const [age, setAge] = useState('');
const [sex, setSex] = useState('');
const [message, setMessage] = useState('');
const [address, setAddress] = useState('');
const {id} = useParams();

const [user, setCurrentUser]= useState('');
const [users, setUser] =useState([]);
const  [userItem, setUserItems] =useState([]);
const [userss, setUsers] =useState([]);
const [uidstorer, setUid] =useState('');
const [accepted, setAcceptedBooking] = useState();



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

const handleSubmit = async (e) => {
  e.preventDefault();


  const user = firebase.auth().currentUser;

  if (user) {

          const db = firebase.firestore();
          const usersRef = db.collection('userBooking')
           usersRef.add({
            uid:user.uid,
            Email:email,
            Name:name,
            Age:age,
            Contact:contact,
            Address:address,
            Owner:userss.Name,
            LandLord:userss.LandLord,
            Status:'Pending',
            
          });
          setEmail('');
          setName('');
          setAge('');
          setContact('');
          setAddress('');
      
        }
};


  return (
<>
<UserNavbar />
< ToastContainer />
<head>
<link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://unpkg.com/bs-brain@2.0.2/components/contacts/contact-1/assets/css/contact-1.css" />
        
</head>

<section class="bg-light py-3 py-md-5">
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
        <h2 class="mb-4 display-5 text-center">Book Now</h2>
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
                <div class="col-12">
                  <label for="fullname" class="form-label">Full Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="fullname" name="fullname" required value= {name} onChange={(e) => setName(e.target.value)} />
                </div>
              <div class="col-12 col-md-6">
                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                    </svg>
                  </span>
                  <input type="email" class="form-control" id="email" name="email" value= {email} required onChange={(e)=>setEmail(e.target.value)} />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <label for="phone" class="form-label">Phone Number</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                    </svg>
                  </span>
                  <input type="tel" class="form-control" id="phone" name="phone" value = {contact} onChange ={(e) =>setContact(e.target.value)} />
                </div>
              </div>


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
                  <label for="fullname" class="form-label">Address <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="address" name="address" required value= {address} onChange={(e) => setAddress(e.target.value)} />
                </div>




              <div class="col-12">
                <label for="message" class="form-label">Message <span class="text-danger">*</span></label>
                <textarea class="form-control" id="message" name="message" rows="3" required value = {message} onChange={(e)=> setMessage(e.target.value)}></textarea>
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

</>
  )
}

export default UserBook