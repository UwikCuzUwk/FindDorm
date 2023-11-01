import React, {useEffect, useState}from 'react'
import { Link } from 'react-router-dom';
import LandlordNavbar from '../Navbar/LandlordNavbar'
import firebase from 'firebase/compat/app'
import Footer from '../../../Navbar/Footer';

function LandlordHome() {
const [item, setItem] = useState([]);
const [user,setCurrentUser] = useState('');

useEffect(() => {
   
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
      fetchUserItems(user.uid);
    } else {
      setCurrentUser(null);
    }
  });
const fetchUserItems = async (uid) => {
  try {
    const db = firebase.firestore();
    const itemsCollection = db.collection('landlordData');

    // Query items collection where the 'uid' field is equal to the current user's UID
    const querySnapshot = await itemsCollection.where('LandLord', '==', uid).get();

    // Extract data from the query snapshot
    const itemsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    // Update the state with the user's items
    setItem(itemsData);
  } catch (error) {
    console.error('Error fetching user items:', error);
  }
};


return () => unsubscribe();

}, []);



  return (
<>
<br />
<LandlordNavbar />
<head>
 <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
</head>

<body>

 
    <div class="container">
    <h1 class="text-center">My Dorm</h1>
    
        <div class="row row-cols-1 row-cols-md-3 g-4 py-5">
          
       
        {item.map((userss, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={userss.Link} class="card-img-top" alt="..." />
                      <div class="card-body">
                          <h5 class="card-title">{userss.Name}
                    </h5>
                         
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                          <h3>₱{userss.Price}</h3>
                      </div>
                       <Link to = {`/landlord_view/${userss.id}`} >
                        <button class="btn btn-primary w-100">view</button>
                       </Link>
                  </div>
              </div>  
              
                )
              
                }
                )
                }

                  <div>
  
    </div>





     </div>
          
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

<Footer />
</>
  )
}

export default LandlordHome