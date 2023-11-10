import React,{useEffect ,useState} from 'react'
import Navbar from '../../Navbar/Navbar'
import logo from '../Image/13027.jpg'
import './Home.css'
import { Button,Modal,Input } from 'react-bootstrap';
import firebase from 'firebase/compat/app'
import { useNavigate, Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'firebase/firestore'
import { firestore } from '../../Database/BackupDatabase';
import Footer from '../../Navbar/Footer';
import Swal from 'sweetalert2';



function Home() {
  const navigate = useNavigate();
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [user, setCurrentUser]= useState('');
  const [users, setUser] =useState([]);
  const  [userItem, setUserItems] =useState([]);
  const [userItem1, setUserItems1] =useState('');
  const [userName, setUserName] =useState('');  

  const [loading, setLoading] = useState(true);
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

    const fetchUserItems1 = async (uid) => {
      try {
        const db = firebase.firestore();
        const itemsCollection = db.collection('user');
        const querySnapshot= await itemsCollection.where('uid', '==', uid).get();
        const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserItems1(itemsData);
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };

    const fetchUser = async (e) => {
      const itemsRef = firestore.collection('landlordData');
      
      try {
        const querySnapshot = await itemsRef.orderBy('Price').get();
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    

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
  fetchUserItems1();

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
      const barangay = collectionRef.where('Barangay', '==', searchTerm);
      const street = collectionRef.where('Street', '==', searchTerm);
      const town = collectionRef.where('Town', '==', searchTerm);
         const city = collectionRef.where('City', '==', searchTerm);


      // Combine the results of name and gender queries
      Promise.all([nameQuery.get(), genderQuery.get(),city.get(), barangay.get(), town.get(), street.get(), locationQuery.get()]).then((querySnapshots) => {
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
      setSearchResults([]);
    }
}

  return (
   <>
   <br />
   <Navbar />
   <br />
 <head>
 <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
       integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</head>
<body>
    <div class="container">
      <br />
    <h1 class="text-center">Dorm For Rent</h1>
   <p class="text-sm-end"> <i class="material-icons" style={{color:"green" }}>account_circle</i><h1 style={{color:"Orange"}}>Hi!  {userName}  </h1> </p> 

  
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
                    <p class="card-text"><i class="material-icons">location_on</i>{userss.Street + " " + userss.Barangay + " " + userss.Town + " " + userss.City}</p>
                    <p class="card-text"><i class="material-icons">attach_money</i>{userss.Price}</p>
                      </div>
                      <Link to = {`/home_view/${userss.id}`} >
                        <button class="btn btn-primary w-100">View</button>
                       </Link>
                  </div>
                  
              </div>  
              
                )
              
                })}

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
        dialogClassName="my-modal responsive"
      >
        <Modal.Header closeButton>
          <Modal.Title>Result</Modal.Title>
        </Modal.Header>
            <Modal.Body> 
            <div class="row row-cols-1 row-cols-md-0 g-2 py-4 m-3 mt-1">
        {searchResults.map((userss)=>{
                return(
                  <div class="cols">
                  <div class="cards">
                      <img src={userss.Link} class="card-img-top" alt="..." />
                      <div class="card-bodys">
                          <h5 class="card-title">{userss.Name}
                    </h5>
                    <p class="card-text"><i class="material-icons">location_on</i>{userss.Street + " " + userss.Barangay + " " + userss.Town + " " + userss.City}</p>
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                          <h3>₱{userss.Price}</h3>
                      </div>
                       <Link to = {`/home_view/${userss.id}`} >
                        <button class="btn btn-primary w-100">View</button>
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
<Footer />

   </>
  )
}

export default Home
