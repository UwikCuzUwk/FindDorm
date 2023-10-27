import React,{useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import LandlordNavbar from '../Navbar/LandlordNavbar';
import { firestore } from '../../../Database/Database';

function LandLordView() {
const {id} = useParams();
const [user, setUser]= useState([])
const  [userItem, setUserItems] =useState([]);

useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const userRef = firestore.collection('landlordData').doc(id); // Replace 'yourUserID' with the actual user ID
        const doc = await userRef.get();

        if (doc.exists) {
          const data = doc.data();
          setUserItems(data.Link|| []);
          setUser(data);
        } else {
          console.log('No such document');
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchUserImages();
  }, []);

  return (
   
   <>
   <br></br>
<LandlordNavbar />

<head>
                                <meta charset='utf-8' />
                                <meta name='viewport' content='width=device-width, initial-scale=1' />
                                <link href='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css' rel='stylesheet' />
                                <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css' rel='stylesheet' />
                                <style></style>
                                <script type='text/javascript' src=''></script>
                                <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js'></script>
                                <script type='text/javascript' src='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js'></script>
                            </head>
                            <body oncontextmenu='return false' class='snippet-body flex-column d-flexs flex-md-row-reverse'>
                            <section class="pt-5 pb-5 d-flex ">
                            <div class="container">
    <h1 class="text-center">My Dorm</h1>
    
        <div class="row row-cols-1 row-cols-md-3 g-4 py-5">
          
       
        {userItem.map((imageLink, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={imageLink} class="card-img-top" alt="..." />
                      <div class="card-body">
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                    
                      </div>
                   
                     
                  </div>
              </div>  
              
                )
              
                })}
                <p>Loading</p>

     </div>
          
    </div>
</section>
 <script type='text/javascript'></script>

                            </body>

</>
   

  )
}

export default LandLordView