import React,{useEffect, useState} from 'react'
import LandlordNavbar from '../Navbar/LandlordNavbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Button,Modal,Input, ToastBody } from 'react-bootstrap';
import {useParams, useNavigate } from 'react-router-dom';
import { auth, firestore, storage} from '../../../Database/Database';
import firebase from 'firebase/compat/app'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject   } from "firebase/storage";
import { addDoc, collection, deleteDoc, getDocs, doc, put} from "firebase/firestore"; 



function Add() {
   
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [progresspercent, setProgresspercent] = useState(0);
    const [name, setName] =useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [cclass, setClass] = useState('');
    const [user, setUser] = useState([]);
    const [id,setId] =useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [message,setMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
     

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
          const itemsCollection = db.collection('landlordData');
          const querySnapshot = await itemsCollection.where('LandLord', '==', uid).get();
          const userList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userList.push(data);
          });
  
          // Update the state with the user's items
          setUserItems(userList);
        } catch (error) {
          console.error('Error fetching user items:', error);
        }
      };
      
      return () => unsubscribe();
      fetchUser();
      fetchUserItems();
    


      }, []);





      const handleImageChange = (event) => {
        const newImages = event.target.files;
        setSelectedImages([...selectedImages, ...newImages]);
      };

const handleSearch =()=>{

}
const handleAddRecord = async (e) => {
  e.preventDefault();
  const urls = [];
  const user = firebase.auth().currentUser;
  for (const image of selectedImages) {
    const storageRef = ref(storage, `landlordimage/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    await uploadTask;

    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
    urls.push(imageUrl);
  }

  setImageUrls(urls);
  alert('Images uploaded successfully');

  const valRef = collection(firestore,'landlordData')
  addDoc(valRef,{LandLord:currentUser.uid, 
    Name:name, 
    uid:user.uid,
    Price:price, 
    Location:location, 
    CLass:cclass, 
    Message:message,
  Link:urls,
     Rate1:0, 
     Rate2:0, 
     Rate3:0, 
     Rate4:0,
      Rate5:0 })
 toast.success('Successfully Added !', 
 {position: toast.POSITION.TOP_CENTER})
 setTimeout(() =>2000);
 handleShow(false)
};
    

const handleEdit =()=>{
    
}
const handleDelete =async()=>{

    
}



const handleUpdate =()=>{
    
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
     <input class="form-control mr-sm-2" type="search"   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Account" aria-label="Search"/>
  <br />
      <Button variant = "primary"   onClick={handleSearch} >Search</Button>
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2><b>Account Room</b></h2></div>
  <div class="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
  <Button variant="primary" onClick={handleShow}>
Add new Room
  </Button>
 </div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Class</th>
                <th>Price</th>
                <th>Location </th>
                <th>Image </th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            
      
               {userItems.map((users, index)=>{
                return(
              <tr key = {users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.CLass}</td>
                   <td>{users.Price}</td>
                   <td>{users.Location}</td>
                    
                     <div>
            {users.Link.map((imageLink, imageIndex) => (
              <img key={imageIndex} src={imageLink} alt={`Image ${imageIndex}`} style={{ width: '80px', height: '80px' }} />
            ))}
          </div>
                    
                      

                   <td>
                  
                    <a href="#" class="edit" onClick={()=>handleEdit(users.uid, users.Name, users.Class,  users.Price, users.Location    )} title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                    <a href="#" class="delete"onClick={()=>handleDelete(users.uid, users.BedRoom, users.LivingRoom, users.DiningArea, users.Kitchen, users.Other)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                     
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Account </td>
        
             
        </tbody>
    </table>
</div>   
</div>  
<div className="model_box">
<Modal
show={show}
onHide={handleClose}
backdrop="static"
keyboard={false}
>
<Modal.Header closeButton>
<Modal.Title>Add Record</Modal.Title>
</Modal.Header>
<Modal.Body>
<form>
    <div class="form-group">
        <input type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Name" value = {name} onChange={(e) => setName(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Location" value = {location} onChange={(e) => setLocation(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="CLass" value = {cclass} onChange={(e) => setClass(e.target.value)} />
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Price" value = {price} onChange={(e) => setPrice(e.target.value)} />
    </div>
    
    <div class="col-12">
                <label for="message" class="form-label">Message <span class="text-danger">*</span></label>
                <textarea class="form-control" id="message" name="message" rows="3" required value = {message} onChange={(e)=> setMessage(e.target.value)}></textarea>
              </div>
    <div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Bedroom</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile" onChange={handleImageChange}/>
</div>

      <button type="submit" class="btn btn-success mt-4" onClick={handleAddRecord}>Add Record</button>
    </form>
</Modal.Body>

<Modal.Footer>
<Button variant="secondary" onClick={handleClose}>
Close
</Button>

</Modal.Footer>
</Modal>


<Modal
show={show2}
onHide={handleClose2}
backdrop="static"
keyboard={false}
>
<Modal.Header closeButton>
<Modal.Title>Result</Modal.Title>
</Modal.Header>
<Modal.Body >
<form> 
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Class</th>
                <th>Location</th>
                <th>Price </th>
    
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            
      
               {searchResults.map((users, index)=>{
                return(
              <tr key = {users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Address}</td>
                   <td>{users.Contact}</td>
                   <td>{users.Email}</td>

                   <td>
                   
                    <a href="#" class="edit" onClick={()=>handleEdit(users.uid, users.Name, users.Address,  users.Contact, users.Email    )} title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                    <a href="#" class="delete"onClick={()=>handleDelete(users.uid)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                     
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Account </td>
                 
        </tbody>
    </table>
</div>   
</div>  

</form>

</Modal.Body>

<Modal.Footer>
<Button variant="secondary" onClick={handleClose2}>
Close
</Button>

</Modal.Footer>
</Modal>









</div>  
<div className="model_box">
<Modal
show={show1}
onHide={handleClose1}
backdrop="static"
keyboard={false}
>
<Modal.Header closeButton>
<Modal.Title>Update Record</Modal.Title>
</Modal.Header>
<Modal.Body>
<form>
    <div class="form-group">
        <input type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Name" value = {name} onChange={(e) => setName(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Address" value = {location} onChange={(e) => setLocation(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Contact No" value = {cclass} onChange={(e) => setClass(e.target.value)} />
    </div>
    <div class="form-group mt-3">
        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email"  value = {price} onChange = {(e) =>setPrice(e.target.value)}  />
    </div>
 
    
      <button type="submit" class="btn btn-success mt-4" onClick={handleUpdate}>Update Record</button>
    </form>
</Modal.Body>

<Modal.Footer>
<Button variant="secondary" onClick={handleClose1}>
Close
</Button>

</Modal.Footer>
</Modal>




</div>  


</div>    
</div>  

< ToastContainer />

</>
  )
}

export default Add
