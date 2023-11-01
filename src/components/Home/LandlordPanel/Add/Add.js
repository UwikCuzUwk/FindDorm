import React,{useEffect, useState} from 'react'
import LandlordNavbar from '../Navbar/LandlordNavbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Button,Modal} from 'react-bootstrap';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { auth, firestore, storage} from '../../../Database/Database';
import firebase from 'firebase/compat/app'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject   } from "firebase/storage";
import { addDoc, collection, deleteDoc, getDocs, doc, updateDoc} from "firebase/firestore"; 
import Swal from 'sweetalert2';
import Footer from '../../../Navbar/Footer';




function Add() {
   const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [show5, setShow5] = useState(false);
    const handleClose5 = () => setShow5(false);
    const handleShow5 = () => setShow5(true);

    const [show6, setShow6] = useState(false);
    const handleClose6= () => setShow6(false);
    const handleShow6= () => setShow6(true);


    const [name, setName] =useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [cclass, setClass] = useState('');
    const [user, setUser] = useState([]);
  
    const [currentUser, setCurrentUser] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [bookID, setBook] = useState([])

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [available, setAvailable] = useState('');
    const [city, setCity] = useState('');
    const[town, setTown] = useState('');
    const[street, setStreet] = useState('');
    const [name1, setName1] = useState('');
    const [barangay, setBarangay] = useState('');
    const [inputFields, setInputFields] = useState(['']);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [view, setView] = useState([]);
    const [landlordData, setLandlordData] =useState([]);
    const [imageItem, setImageItem] = useState([])
    const [landlordId, setlandlordID]= useState('')

  const [Name5, setName5] = useState('');
  const [Price5, setPrice5] = useState('');
  const [LandMark, setLandMark] = useState('');
  const [Slot, setSlot] = useState('');
  const [iddd, setIDDD] = useState('')
  const [owenerName, setOwnerName] = useState('');
  const userCollection = firebase.firestore().collection('user');
  const [userName10, setUserName10] = useState('');
  const [address10, setAddress10] = useState('');
  const [email10, setUserEmail10] = useState('');
  const [contact10, setContact10] = useState('');
  const [photo10, setPhoto10] = useState('');
  const [userrName, setuserName] = useState('')
  const [available2, setAvailable2] = useState('')

   useEffect(() => {
   
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            setCurrentUser(user);
            fetchUserItems(user.uid);
            fetchUserItems1(user.uid);
          
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
            const data = { id: doc.id,...doc.data() };
            userList.push(data);
          });
  
          // Update the state with the user's items
          setUserItems(userList);
        } catch (error) {
          console.error('Error fetching user items:', error);
        }
      };
    
      const fetchUserItems1= async (uid) => {
        try {
          const db = firebase.firestore();
          const itemsCollection = db.collection('userAdmin');
          const querySnapshot = await itemsCollection.where('uid', '==', uid).get();
          querySnapshot.forEach((doc) => {
            const data = { id: doc.id,...doc.data() };
            setuserName(data);
          });
  
          // Update the state with the user's items
        
        } catch (error) {
          console.error('Error fetching user items:', error);
        }
      };

      
      const currentUser2 = firebase.auth().currentUser;
      if (currentUser2) {
        const userCollection = firebase.firestore().collection('landlordData');
  
        userCollection
          .where('uid', '==', currentUser2.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setOwnerName(userData.Name);
              setAvailable2(userData.Available);
            });
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }




      return () => unsubscribe();
      }, []);
    
    

      const available3 = parseInt(available2) - 1;



  const handleInputChange = (index, event) => {
          const newInputFields = [...inputFields];
          newInputFields[index] = event.target.value;
          setInputFields(newInputFields);
  };

  const handleAddField = () => {
          setInputFields([...inputFields, '']);
        };
      const handleImageChange = (event) => {
        const newImages = event.target.files;
        setSelectedImages([...selectedImages, ...newImages]);
      };

const handleSearch =()=>{
}

const handleAddRecord = async (e) => {
  e.preventDefault();
  const available2 = parseInt(available) + 1;
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
  const valRef = collection(firestore,'landlordData')
  addDoc(valRef,{LandLord:currentUser.uid, 
    Email:currentUser.email,
    Name:name, 
    uid:user.uid,
    Price:price, 
    City:city,
    Town:town,
    Street:street,
    Barangay:barangay,
    CLass:cclass, 
    Message:inputFields,
    Available:available2,
    LandlordName:userrName.Name,
  Link:urls,
     Rate1:0, 
     Rate2:0, 
     Rate3:0, 
     Rate4:0,
      Rate5:0 })
      
 toast.success('Successfully Added !', 
 {position: toast.POSITION.TOP_CENTER})
 setTimeout(() =>2000);
navigate('/landlord_home')

};


const handleView =async (id)=>{
  setIDDD(id)
  setShow3(true);
  const db = firebase.firestore();
  const docRef = db.collection('landlordData').doc(id);
  const docSnapshot = await docRef.get();

  if (docSnapshot.exists) {
    const data = docSnapshot.data();
    setImageItem(data.Link || []);
    setLandlordData(data);
    setlandlordID()
  } else {
    console.log('Document not found');
  }


}
    

const handleEdit =()=>{
setShow4(true)
setName5(landlordData.Name)
setPrice5(landlordData.Price)
setLandMark(landlordData.Class)
setSlot(parseInt(landlordData.Available)-1)

}
const handleDelete =async(id)=>{  
  const db = firebase.firestore();
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection('landlordData').doc(id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error deleting document: ', error);
      });

      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
}

const handleUpdate =()=>{
    
}
const handleFinalUpdate =async()=>{
  try{
    const updateData = doc(firestore,"landlordData",iddd)
        await updateDoc(updateData,{Name:Name5, Price:Price5, Available:Slot})
        setShow4(false)
  }catch(error){
    toast.error('Error', error.message, 
    {position: toast.POSITION.TOP_CENTER})

  }

}

const handleGet = async(Name)=>{
  setShow5(true)
  const collectionName = 'userBooking';
      const querySnapshot = await firestore.collection(collectionName).where('DormName', '==',Name).where('Status','==','Accept').get();

      const pendingBookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBook(pendingBookingData); 
}
const handleProfile = async(uid)=>{
setShow6(true)
  userCollection
    .where('uid', '==',uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUserName10(userData.Name);
        setAddress10(userData.Address);
        setUserEmail10(userData.Email);
        setContact10(userData.Contact);
        setPhoto10(userData.Photo);
      
      });
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}

  return (
<>

<LandlordNavbar />

<Modal
        show={show3}
        onHide={() => setShow3(false)}
        dialogClassName="modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <html lang="en" />
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link href="./style.css" rel="stylesheet"  />
  </head>
  <body>
    <h1 class = "text-center "></h1>
  <div class="container mt-5">
        <form class="row g-3">
            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">Room Name</label>
              <input type="text" class="form-control" id="inputAddress" value = {landlordData.Name} />
            </div>
            <div class="col-md-6">
              <label for="inputPassword4" class="form-label">Address</label>
              <input type="text" class="form-control" id="inputAddress" value = {landlordData.Street+" " +landlordData.Barangay+  " " +landlordData.Town + " " +landlordData.City} />
            </div>
            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">Owner's Name</label>
              <input type="text" class="form-control" id="inputAddress" value = {landlordData.LandlordName} />
            </div>
            <div class="col-md-2">
              <label for="inputZip" class="form-label">Rating</label>
              <input type="text" class="form-control" id="inputZip"value = {landlordData.Rate1+landlordData.Rate2+landlordData.Rate3+landlordData.Rate4+landlordData.Rate5 } />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Price</label>
              <input type="text" class="form-control" id="inputCity" value={landlordData.Price}   />
            </div>
            <div class="col-md-4">
              <label for="inputState" class="form-label">LandMark</label>
              <input type="text" class="form-control" id="inputZip"value = {landlordData.CLass} />
  

            </div>
            <div class="col-md-2">
              <label for="inputZip" class="form-label">Available Slot</label>
              <input type="text" class="form-control" id="inputZip"value = {parseInt(landlordData.Available)-1} />
            </div>
        
         
          </form>
          <hr />
          <br />
          <div class="col-12">
              <button type="submit" class="btn btn-primary"onClick={()=>handleEdit(landlordData.uid)} >Update</button>
            </div>
            <hr />
            <div class="row">
            <div class="row row-cols-1 row-cols-md-3 g-1 py-5">
            {imageItem.map((imageLink, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={imageLink} class="" alt="..." />
                      <div class="card-body">
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
   
                      </div>
                  </div>
              </div>  
                
                )
              
                })}
                </div>  
                </div>
    </div>	

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

  
  </body>
        </Modal.Body>
      </Modal>



      <Modal
        show={show4}
        onHide={() => setShow4(false)}
        dialogClassName="modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <html lang="en" />
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
    <link href="./style.css" rel="stylesheet"  />
  </head>
  <body>
    <h1 class = "text-center ">Update</h1>
  <div class="container mt-5">
        <form class="row g-3">
            <div class="col-md-6">
              <label for="inputEmail4" class="form-label">Room Name</label>
              <input type="text" class="form-control" id="inputAddress" value = {Name5} onChange={(e) => setName5(e.target.value)} />
            </div>
            <div class="col-md-6">
              <label for="inputCity" class="form-label">Price</label>
              <input type="text" class="form-control" id="inputCity" value={Price5}  onChange={(e) => setPrice5(e.target.value)} />
            </div>
            <div class="col-md-2">
              <label for="inputZip" class="form-label">Available Slot</label>
              <input type="number" class="form-control" id="inputZip"value ={Slot} onChange={(e) => setSlot(e.target.value)}/>
            </div>
        
         
          </form>
          <hr />
          <br />
          <div class="col-12">
              <button type="submit" class="btn btn-primary"onClick={handleFinalUpdate}>Submit</button>
            </div>
            <hr />
            <div class="row">
            <div class="row row-cols-1 row-cols-md-3 g-1 py-5">
            {imageItem.map((imageLink, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={imageLink} class="" alt="..." />
                      <div class="card-body">
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
   
                      </div>
                  </div>
              </div>  
                
                )
              
                })}
                </div>  
                </div>
    </div>	

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

  
  </body>
       


        </Modal.Body>
      </Modal>


<Modal
        show={show5}
        onHide={() => setShow5(false)}
        dialogClassName="modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form> 
        <h1 class = "text-center" style ={{color:"green"}}>Inquired in This Room</h1>
<div class="row">
 
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email </th>
    
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
                
      
               {bookID.map((users, index)=>{
                return(
              <tr key = {users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Address}</td>
                   <td>{users.Contact}</td>
                   <td>{users.Email}</td>

                   <td>
                   <a href="#" class="delete l "onClick={()=>handleProfile(users.uid)} title="Profile" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">person_pin</i></a>
                   <Link to ={`/landlord_payment/${users.uid}`}>
                   <a href="#" class="delete"title="Payment" data-toggle="tooltip" style={{color:"orange"}}> <i class="large material-icons">payment</i></a>
                    </Link>
                     
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
      </Modal>




<Modal
        show={show6}
        onHide={() => setShow6(false)}
        dialogClassName="modal-xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <section style={{color:"Orange"}}>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <img src={photo10}alt="avatar "
              class="rounded-circle img-fluid" style={{width:"150px"}} />
            <h5 class="my-3"><p>{userName10}</p></h5>
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
                <p class="text-muted mb-0" >{userName10}</p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{email10}</p>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Mobile</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0" >{contact10}</p>
              </div>
            </div>
            <hr />
          </div>
        </div>
       
      </div>
    </div>
  </div>
</section>



        </Modal.Body>
      </Modal>


<div class="container">

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
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2><b>My Room</b></h2></div>
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
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            
      
               {userItems.map((users, index)=>{
                return(
              <tr key = {users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                  {/*   <div>
            {users.Link.map((imageLink, imageIndex) => (
              <img key={imageIndex} src={imageLink} alt={`Image ${imageIndex}`} style={{ width: '80px', height: '80px' }} />
            ))}
          </div>
            */}   
                      

                   <td class = "" >

                 <a href="#" class="delete l "onClick={()=>handleDelete(users.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                    <a href="#" class="view l"onClick={()=>handleView(users.id)} title="View" data-toggle="tooltip" style={{color:"green"}}><i class="material-icons ">visibility</i></a>
                    <a href="#" class="view l"onClick={()=>handleGet(users.Name)} title="Inquired" data-toggle="tooltip" style={{color:"green"}}><i class="material-icons">face</i></a>
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
dialogClassName="modal-lg"
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
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="City" value = {city} onChange={(e) => setCity(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Town" value = {town} onChange={(e) => setTown(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Street" value = {street} onChange={(e) => setStreet(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Barangay" value = {barangay} onChange={(e) => setBarangay(e.target.value)}/>
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Land Mark" value = {cclass} onChange={(e) => setClass(e.target.value)} />
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Price" value = {price} onChange={(e) => setPrice(e.target.value)} />
    </div>
    <div class="form-group mt-3">
        <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder=" Space Available " value = {available} onChange={(e) => setAvailable(e.target.value)} />
    </div>
    {inputFields.map((field, index) => (
     <div class="col-12">
     <label for="message" class="form-label">Amenities<span class="text-danger">*</span></label>
     <textarea class="form-control" id="message" name="message" rows="1" required key={index}
            type="text"
            value={field}
            onChange={(event) => handleInputChange(index, event)}></textarea>
   </div>

        ))}
          <button class="btn btn-success mt-2" onClick={handleAddField}>Add Field</button>
    
    <div class="mb-3">
  <label for="formFile" class="form-label" style ={{left:"10px"}}>Photos</label>
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
<Footer />
</>
  )
}

export default Add
