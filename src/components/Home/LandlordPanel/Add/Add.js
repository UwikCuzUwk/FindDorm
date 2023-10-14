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

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [image, setImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [imglist, setImglist] = useState([]);
    const [imageUrl, setImageUrls] = useState('')
    const [imageUrl1, setImageUrls1] = useState('')
    const [imageUrl2, setImageUrls2] = useState('')
    const [imageUrl3, setImageUrls3] = useState('')
    const [imageUrl4, setImageUrls4] = useState('')
     

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
    
          // Query items collection where the 'uid' field is equal to the current user's UID
          const querySnapshot = await itemsCollection.where('LandLord', '==', uid).get();
    
          // Extract data from the query snapshot
          const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          
          // Update the state with the user's items
          setUserItems(itemsData);
        } catch (error) {
          console.error('Error fetching user items:', error);
        }
      };
      
      
      fetchUser();
    
      return () => unsubscribe();

      }, []);


      useEffect(() => {
        const fetchImageUrls = async () => {
          const querySnapshot = await getDocs(collection(firestore, 'landlordData'));
          const urls = querySnapshot.docs.map((doc) => doc.data().BedRoom);
          setImageUrls(urls);
        };
        const fetchImageUrls1 = async () => {
          const querySnapshot1 = await getDocs(collection(firestore, 'landlordData'));
          const urls1 = querySnapshot1.docs.map((doc) => doc.data().LivingRoom);
          setImageUrls1(urls1);
        };
        const fetchImageUrls2 = async () => {
          const querySnapshot2 = await getDocs(collection(firestore, 'landlordData'));
          const urls2 = querySnapshot2.docs.map((doc) => doc.data().DiningArea);
          setImageUrls1(urls2);
        };
        const fetchImageUrls3 = async () => {
          const querySnapshot3 = await getDocs(collection(firestore, 'landlordData'));
          const urls3 = querySnapshot3.docs.map((doc) => doc.data().Kitchen);
          setImageUrls3(urls3);
        };
        const fetchImageUrls4 = async () => {
          const querySnapshot4 = await getDocs(collection(firestore, 'landlordData'));
          const urls4 = querySnapshot4.docs.map((doc) => doc.data().Other);
          setImageUrls4(urls4);
        };

    
        fetchImageUrls();
        fetchImageUrls1();
        fetchImageUrls2();
         fetchImageUrls3();
         fetchImageUrls4();
      }, []);
   

      const handleUpload = (e) =>{
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    }
     const handleUpload1= (e) =>{
      if (e.target.files[0]) {
        setImage1(e.target.files[0]);
      }
   }
   const handleUpload2 = (e) =>{
    if (e.target.files[0]) {
      setImage2(e.target.files[0]);
    }
    }
    const handleUpload3 = (e) =>{
    if (e.target.files[0]) {
    setImage3(e.target.files[0]);
  }
  }
  const handleUpload4 = (e) =>{
  if (e.target.files[0]) {
    setImage4(e.target.files[0]);
  }
  }



const handleSearch =()=>{

}
const handleAddRecord =async(e)=>{  
  e.preventDefault();
    if (image == null) {
      toast.error("Please select an image");
      return;
    }
    if (image == null) {
      toast.error("Please select an image");
      return;
    }
    try {
    const storageRef = ref(storage, `landlordimage/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    const snapshot = await getDownloadURL(uploadTask.snapshot.ref);

    const storageRef1 = ref(storage, `landlordimage/${image1.name}`);
    const uploadTask1 = uploadBytesResumable(storageRef1, image1);
    const snapshot1 = await getDownloadURL(uploadTask1.snapshot.ref);
  
    const storageRef2 = ref(storage, `landlordimage/${image2.name}`);
    const uploadTask2 = uploadBytesResumable(storageRef2, image2);
    const snapshot2= await getDownloadURL(uploadTask2.snapshot.ref);

    const storageRef3 = ref(storage, `landlordimage/${image3.name}`);
    const uploadTask3 = uploadBytesResumable(storageRef3, image3);
    const snapshot3 = await getDownloadURL(uploadTask3.snapshot.ref);

    const storageRef4 = ref(storage, `landlordimage/${image4.name}`);
    const uploadTask4 = uploadBytesResumable(storageRef4, image4);
    const snapshot4 = await getDownloadURL(uploadTask4.snapshot.ref);
   
    const valRef = collection(firestore,'landlordData')
    addDoc(valRef,{LandLord:currentUser.uid, Name:name, Price:price, Location:location, CLass:cclass, BedRoom:snapshot, LivingRoom:snapshot1, DiningArea:snapshot2, Kitchen:snapshot3, Other:snapshot4})
   toast.success('Successfully Added !', 
   {position: toast.POSITION.TOP_CENTER})
   setTimeout(() =>2000);
   
    console.log('Image uploaded successfully with ID: ', currentUser.uid);
  } catch (error) {
    console.error('Error uploading image: ', error.message);
  }
  }
    

const handleEdit =()=>{
    
}
const handleDelete =async(uid, BedRoom, LivingRoom, DiningArea, Kitchen, Other)=>{
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
  const querySnapshot = await getDocs(collection(firestore, 'landlordData'));
  querySnapshot.forEach((doc) => {
    if (doc.data().imageUrl === BedRoom) {
      deleteDoc(doc.ref);
    }
  });
  const imageRef1 = ref(storage, imageUrl1);
  await deleteObject(imageRef1);
  const querySnapshot1 = await getDocs(collection(firestore, 'landlordData'));
  querySnapshot1.forEach((doc) => {
    if (doc.data().imageUrl1 === LivingRoom) {
      deleteDoc(doc.ref);
    }
  });
  const imageRef2 = ref(storage, imageUrl2);
  await deleteObject(imageRef2);
  const querySnapshot2 = await getDocs(collection(firestore, 'landlordData'));
  querySnapshot2.forEach((doc) => {
    if (doc.data().imageUrl2 === DiningArea) {
      deleteDoc(doc.ref);
    }
  });
  const imageRef3 = ref(storage, imageUrl3);
  await deleteObject(imageRef3);
  const querySnapshot3 = await getDocs(collection(firestore, 'landlordData'));
  querySnapshot3.forEach((doc) => {
    if (doc.data().imageUrl3 === Kitchen) {
      deleteDoc(doc.ref);
    }
  });
  const imageRef4 = ref(storage, imageUrl4);
  await deleteObject(imageRef4);
  const querySnapshot4 = await getDocs(collection(firestore, 'landlordData'));
  querySnapshot4.forEach((doc) => {
    if (doc.data().imageUrl4 === Other) {
      deleteDoc(doc.ref);
    }
  });
  const deleteVal =  doc(firestore,"landlordData",uid)
  await deleteDoc(deleteVal)
  toast.success('Deleted!', 
  {position: toast.POSITION.TOP_CENTER})
    
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
                <th>BedRoom </th>
                <th>Living Room </th>
                <th>Dining Area </th>
                <th>Kitchen Area </th>
                <th>Other</th>
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
                  <td><img src={users.BedRoom} alt="User" style={{ width: '80px', height: '80px' }} /></td>
                  <td><img src={users.LivingRoom} alt="User" style={{ width: '80px', height: '80px' }} /></td>
                  <td><img src={users.DiningArea} alt="User" style={{ width: '80px', height: '80px' }} /></td>
                  <td><img src={users.Kitchen} alt="User" style={{ width: '80px', height: '80px' }} /></td>
                  <td><img src={users.Other} alt="User" style={{ width: '80px', height: '80px' }} /></td>

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
    <div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Bedroom</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile"  onChange={(e)=>handleUpload(e)}/>
</div>
<div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Living Room</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile"  onChange={(e)=>handleUpload1(e)}/>
</div>
<div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Dining Area</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile"  onChange={(e)=>handleUpload2(e)}/>
</div>
<div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Kitchen</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile"  onChange={(e)=>handleUpload3(e)}/>
</div>
<div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Other</label>
  <input class="form-control"  multiple accept="image/*"  type="file" id="formFile"  onChange={(e)=>handleUpload4(e)}/>
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