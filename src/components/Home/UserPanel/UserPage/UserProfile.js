import React, {useState,useEffect} from 'react'
import { Button,Modal} from 'react-bootstrap';
import UserNavbar from '../UserNavbar/UserNavbar'
import firebase from 'firebase/compat/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom';

import { ref, getDownloadURL, uploadBytesResumable, deleteObject   } from "firebase/storage";
import { addDoc, collection, deleteDoc, getDocs, doc, put} from "firebase/firestore"; 
import { auth, storage, firestore } from '../../../Database/Database';
import Footer from '../../../Navbar/Footer';
import bookimg from '../../../LoginPanel/Image/13027.jpg'
import contact from '../../../LoginPanel/Image/cotact.avif'


function UserProfile() {

const [userName, setUserName] =useState('');
const [userEmail, setUserEmail] = useState('');
const [contact, setContact] = useState('');
const[address, setAddress] = useState('');
const [selectedImages, setSelectedImages] = useState([]);
const [photo, setPhoto] = useState('');
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const [user, setCurrentUser]= useState('');
const [users, setUser] =useState([]);
const [userID,setuserID] = useState('');
const [file, setFile] = useState(null);
const [imageUrl, setImageUrl] = useState('');
const [bookData, setBookingData] = useState([]);
const [ownerName1, setOwnerName1] = useState('');
const[dormName1, setDormName1] = useState('');
const [bookingStatus, setBookingStatus] = useState([]);
const [userContact1, setUserContact1] = useState('')
const [userAddress1, setUserAddress1] = useState('')
const [userAge1, setUserAge1] = useState('')
const [userGender1, setUserGender1] = useState('')
const [userName1, setUserName1] =useState('')
const [userEmail1, setUserEmail1] = useState('');
const [recipient, setRecipient] = useState('');
const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');
const [userOwnerEmail1, setuserOwnerEmail1] = useState('')

useEffect(() => {
   
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
   
      setuserID(user.uid);
      getData(user.uid)
      getData1(user.uid)
      getData2(user.uid)
    } else {
      setCurrentUser(null);
    }
  });
  const getData = async(uid)=>{
    try {
   
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot = await firestore.collection(collectionName).where('uid', '==', uid).where('Status', '==', 'Accept').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
       
      }));
    
      setBookingStatus(pendingBookingData);
      setuserOwnerEmail1(pendingBookingData.OwnerEmail)
    
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  }
  const getData1 = async(uid)=>{
    try {
   
      const collectionName = 'userBooking'; // Replace with your Firestore collection name
      const querySnapshot =  firestore.collection(collectionName)

      querySnapshot
      .where('uid', '==', uid)
      .where('Status', '==', 'Accept')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
         setuserOwnerEmail1(userData.OwnerEmail)
       
        
    
        });
      })
    

    
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  }
  const getData2 = async(uid)=>{
    try {
      const userCollection = firebase.firestore().collection('user');

      userCollection
        .where('uid', '==', uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setUserName(userData.Name);
            setAddress(userData.Address);
            setUserEmail(userData.Email);
            setContact(userData.Contact);
            setPhoto(userData.Photo);
          
      
          });
        })
    

    
    } catch (error) {
      console.error('Error fetching pending bookings: ', error);
    }
  }


getData();
getData1();
getData2();
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
          setUserName1(userData.Name);
          setUserEmail1(userData.Email);
          setUserAddress1(userData.Address);
          setUserContact1(userData.Contact)
          setUserAge1(userData.Age)
          setUserGender1(userData.Gender)
        
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }
}, []);




const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};



const handleUpload =async()=>{
 if(file!==null){

 
  const usersCollection = firestore.collection('user');
  const userDoc = await usersCollection.where('uid', '==',user.uid).get();

  const image = file; // Assuming 'selectedImage' is a File object for the single image you want to upload

  const storageRef = ref(storage, `photo/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);
  await uploadTask;
  
  const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
 
  userDoc.forEach(async (doc) => {
    await doc.ref.update({
     Photo:imageUrl,
    });
  });
  toast.success('Images uploaded successfully');
}else{
  toast.error("Please select an image");
}
}

const handleHistory =async(e)=>{
  alert("Cute mo")
}
const handleMessage = async(LandLord) =>{
 setShow(true)
}
const handleContact = async() =>{ 

  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${userOwnerEmail1}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`);
}
  return (
   <>
   <UserNavbar />
   <br />
   <section style={{color:"Orange"}}>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img src={photo}alt="avatar "
              class="rounded-circle img-fluid" style={{width:"200px"}} />
            <h5 class="my-3"><p>{userName}</p></h5>
   
            <div class="d-flex justify-content-center mb-2">
              <button type="button" class="btn btn-outline-primary ms-1"onClick={handleUpload} >Update </button>
            </div>
            <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      
      </div>
    
      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-body">
            <hr />
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Full Name</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{userName}</p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{userEmail}</p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Mobile</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{contact}</p>
              </div>
            </div>
            <hr />
          </div>
        </div>
       
      </div>


      
    </div>
  </div>
</section>
<section style={{color:"Orange"}}>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img src={bookimg}alt="avatar "
              class="rounded-circle img-fluid" style={{width:"300px"}} />
            <h5 class="my-3"><p>My Dorm </p></h5>
            <div class="d-flex justify-content-center mb-2">
             
            
              <Link to ={`/user_payment/${userID}`}>
              <button type="button" class="btn btn-outline-primary ms-1">History Payed</button> 
                </Link>
                
               
            </div>  
          </div>
        </div>
      
      </div>
      {bookingStatus.map((users, index)=>{
                return(
                  <div class="col-lg-8">
                  <div class="card mb-4">
                    <div class="card-body">
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <p class="mb-0">Full Name</p>
                        </div>
                        <div class="col-sm-9">
                          <p class="text-muted mb-0" >{userName}</p>
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <p class="mb-0">Owner Name</p>
                        </div>
                        <div class="col-sm-9">
                          <p class="text-muted mb-0" >{users.Owner}</p>
                        </div>
                      </div>
                      <hr />
                      <div class="row">
                        <div class="col-sm-3">
                          <p class="mb-0">DormName</p>
                        </div>
                        <div class="col-sm-9">
                          <p class="text-muted mb-0" >{users.DormName}</p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-primary ms-1"onClick={()=>handleMessage(users.LandLord)}>Contact Us</button>
                </div>
                
                )
              
                })}
 
      
    </div>
  </div>
</section>
<Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-dialog modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <section class="bg-light py-5 py-xl-6">
  <div class="container mb-5 mb-md-6">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 text-center">
        <h2 class="mb-4 display-5">Contact Us</h2>
        <p class="text-secondary mb-4 mb-md-5">Get in Touch</p>
        <hr class="w-50 mx-auto mb-0 text-secondary" />
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-lg-center">
      <div class="col-12 col-lg-9">
        <div class="bg-white border rounded shadow-sm overflow-hidden">
          <form>
            <div class="row gy-4 gy-xl-5 p-4 p-xl-5">
              <div class="col-12">


                <label for="fullloclocationaname" class="form-label">Email<span class="text-danger">*</span></label>
                 <input type="text"  disabled class="form-control" id="" required  value = {userEmail}/>

                 <label for="fullloclocationaname" class="form-label">Name<span class="text-danger" >*</span></label>
                 <input type="text"  disabled class="form-control" id="" required value = {userName}/>
                 
                  <label for="fullloclocationaname" class="form-label">Email of Owner<span class="text-danger">*</span></label>
                  <input type="text"  disabled class="form-control" id="" required  value = {userOwnerEmail1} onChange={(e) => setuserOwnerEmail1(e.target.value)}/>
           
              
                 <label for="fullloclocationaname" class="form-label">Subject<span class="text-danger" >*</span></label>
                 <input type="text"   class="form-control" id="location" value={subject}
        onChange={(e) => setSubject(e.target.value)} required/> 

                 <label for="fullloclocationaname" class="form-label">Message<span class="text-danger" >*</span></label>
                 <textarea type="text"  rows = "8"   value={message}
        onChange={(e) => setMessage(e.target.value)} class="form-control"/>

              </div>
              <div class="col-12">
                <div class="d-grid">
                  <button class="btn btn-primary btn-lg"onClick={handleContact}>Submit</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>


   
        </Modal.Body>
      </Modal>
< ToastContainer />
<Footer />
   </>
  )
}

export default UserProfile