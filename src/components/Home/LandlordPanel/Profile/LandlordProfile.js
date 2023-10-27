import React, {useState,useEffect} from 'react'
import './LandlordProfile.css'

import firebase from 'firebase/compat/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { ref, getDownloadURL, uploadBytesResumable, deleteObject   } from "firebase/storage";
import { addDoc, collection, deleteDoc, getDocs, doc, put} from "firebase/firestore"; 
import { auth, storage, firestore } from '../../../Database/Database'
import LandlordNavbar from '../Navbar/LandlordNavbar';


function LandlordProfile() {

const [userName, setUserName] =useState('');
const [userEmail, setUserEmail] = useState('');
const [contact, setContact] = useState('');
const[address, setAddress] = useState('');
const [selectedImages, setSelectedImages] = useState([]);
const [photo, setPhoto] = useState('');

const [user, setCurrentUser]= useState('');
const [users, setUser] =useState([]);
const [userID,setuserID] = useState('');
const [file, setFile] = useState(null);
const [imageUrl, setImageUrl] = useState('');
useEffect(() => {
   
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });






return () => unsubscribe();

}, []);


if (user) {
  const userCollection = firebase.firestore().collection('userAdmin');

  userCollection
    .where('uid', '==', user.uid)
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
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};



const handleUpload =async()=>{
 if(file!==null){

 
  const usersCollection = firestore.collection('userAdmin');
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

  return (
   <>
<LandlordNavbar />
   <br />
   <section style={{color:"Orange"}}>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img src={photo}alt="avatar "
              class="rounded-circle img-fluid" style={{width:"150px"}} />
            <h5 class="my-3"><p>{userName}</p></h5>
   
            <div class="d-flex justify-content-center mb-2">    
              <button type="button" class="btn btn-outline-primary ms-1"onClick={handleUpload} >Update Photo</button>
            </div>
            <div>
            <input class="btn btn-outline-primary ms-1" type="file" accept="image/*" onChange={handleFileChange} />
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
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Address</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{address}</p>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </div>
</section>
< ToastContainer />
   </>
  )
}

export default LandlordProfile