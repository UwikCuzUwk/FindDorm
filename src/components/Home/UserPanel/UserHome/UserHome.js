import React,{useEffect ,useState} from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import './UserHome.css'
import '../../LandlordPanel/LandLordBooking/LandLord.css'
import { Button,Modal,Input } from 'react-bootstrap';


import { useNavigate, Link} from 'react-router-dom';
import { auth, firestore, storage} from '../../../Database/Database';
import firebase from 'firebase/compat/app'
import { ref, getDownloadURL, uploadBytesResumable, deleteObject   } from "firebase/storage";
import { addDoc, collection, deleteDoc, getDocs, doc, put, query, where, or} from "firebase/firestore"; 
import 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function UserHome() {
  const navigate = useNavigate();
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [user, setCurrentUser]= useState('');
  const [users, setUser] =useState([]);
  const  [userItem, setUserItems] =useState([]);

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
  fetchUserItems();

  return () => unsubscribe();

  }, []);
 
  const db = firebase.firestore();
  const collectionRef = db.collection('landlordData'); 





const handleSearch=async()=>{

    setShow2(true);
    if (searchTerm) {
      const nameQuery = collectionRef.where('Name', '==', searchTerm);
      const genderQuery = collectionRef.where('Price', '==', searchTerm);
      const locationQuery = collectionRef.where('Location', '==', searchTerm);


      // Combine the results of name and gender queries
      Promise.all([nameQuery.get(), genderQuery.get(), locationQuery.get()]).then((querySnapshots) => {
        const matchingDocs = [];
        querySnapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            matchingDocs.push({id:doc.id, ...doc.data()});
          });
        });
        setSearchResults(matchingDocs);
        console.log(matchingDocs);
      });
    } else {
      // Clear results when search bar is empty
      setSearchResults([]);
    }

}

   
  

  return (
 <>
 <UserNavbar />
 <head>
 <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
       integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
</head>

<body>

     
    <div class="container py-5">
      
    <h1 class="text-center">Dorm For Rent</h1>
    <div class="input-group rounded">
  <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}    aria-describedby="search-addon" />
  <span class="input-group-text border-0" id="search-addon" onClick={handleSearch}>
    <i class="fas fa-search"></i>
  </span>
</div>
        <div class="row row-cols-1 row-cols-md-3 g-4 py-5">
        {users.map((userss, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={userss.Link} class="card-img-top" alt="..." />
                      <div class="card-body">
                          <h5 class="card-title">{userss.Name}
                    </h5>
                    <p class="card-text"><i class="material-icons">location_on</i>{userss.Location}</p>
                          <p class="card-text">Welcome to mobile legends 10 hours til the enemy reaches the battlefield smash them</p>
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                          <h3>₱{userss.Price}</h3>
                          <Link to = {`/user_booking/${userss.id}`} >
                        <button  class="btn btn-primary">Book Now</button>
                       </Link>
                      </div>
                       <Link to = {`/user_view/${userss.id}`} >
                        <button class="btn btn-primary w-100">Overview</button>
                       </Link>
                  </div>
              </div>  
              
                )
              
                })}
                <p>Loading</p>

     </div>
          
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>
<Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}  
        dialogClassName="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Result</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <div class="row row-cols-1 row-cols-md-1 g-4 py-5 m-5 mt-0">
        {searchResults.map((userss, index)=>{
                return(
                  <div class="col">
                  <div class="cards">
                      <img src={userss.Link} class="card-img-top" alt="..." />
                      <div class="card-bodys">
                          <h5 class="card-title">{userss.Name}
                    </h5>
                    <p class="card-text"><i class="material-icons">location_on</i>{userss.Location}</p>
                          <p class="card-text">{userss.Message}</p>
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                          <h3>₱{userss.Price}</h3>
                          <Link to = {`/user_booking/${userss.id}`} >
                        <button  class="btn btn-primary">Book Now</button>
                       </Link>
                      </div>
                       <Link to = {`/user_view/${userss.id}`} >
                        <button class="btn btn-primary w-100">Overview</button>
                       </Link>
                  </div>
              </div>  
              
                )
              
                })}
          

     </div>
           
                            
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      

      < ToastContainer />
 </>
  )
}

