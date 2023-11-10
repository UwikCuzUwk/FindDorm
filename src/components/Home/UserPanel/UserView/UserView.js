import React,{useEffect,useState} from 'react'
import './UserView.css'
import { auth, firestore, storage} from '../../../Database/Database';
import firebase from 'firebase/compat/app'  
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../UserNavbar/UserNavbar';
import { Link } from 'react-router-dom';
import { Button,Modal,Input } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import Footer from '../../../Navbar/Footer';
import { PieChart } from '@mui/x-charts/PieChart';

function UserView() {

    const {id} = useParams();
    const [users, setCurrentUser]= useState('');
    const [user, setUser] =useState([]);
    const navigate = useNavigate();

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2= () => setShow2(true);
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const handleShow3= () => setShow3(true);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const  [userItem, setUserItems] =useState([]);
    const [userID, setUserID] = useState('');
    const [name, setUserName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmaill] = useState('');
    const [aminity, setAminity] = useState([]);
    const [available, setAvailable] = useState('');

    const[userName20, setUserName20] = useState('');
    const[userEmail20, setUserEmail20] = useState('');
    const[photo20, setPhoto20] = useState('');
  const [commentData, setCommentData] = useState([])
  const [timestamp1, setTimeStamp] = useState('')
  const [formatDate, setFormattedData] = useState('')
  const [currentUser1, setCurrentUID] = useState('');
  const [locations, setLocations] = useState([]);
    const[comment, setComment] = useState('')



    useEffect(() => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        setCurrentUID(currentUser.uid);
        const userCollection = firebase.firestore().collection('user');
        userCollection
          .where('uid', '==', currentUser.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserName20(userData.Name);
              setUserEmail20(userData.Email);
              setPhoto20(userData.Photo);
            });
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    }, []);

    useEffect(() => {
      const fetchUserImages = async () => {
        try {
          const userRef = firestore.collection('landlordData').doc(id); // Replace 'yourUserID' with the actual user ID
          const doc = await userRef.get();
  
          if (doc.exists) {
            const data = doc.data();
            setUserItems(data.Link || []);
            setUserID(data.uid);
            setUser(data)
            setAminity(data.Message|| [])
            setAvailable(data.Available || [])
            fetchData(data.uid)
          } else {
            console.log('No such document');
          }
        } catch (error) {
          console.error('Error fetching data from Firestore:', error);
        }
      };
      const userCollection = firebase.firestore().collection('userComments');
      userCollection
        .where('LandlordID', '==', userID)
        .get()
        .then((querySnapshot) => {
          const userDataArray = [];

          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            userDataArray.push(userData);
          });

          setCommentData(userDataArray);
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
        const userCollection3 = firebase.firestore().collection('userAdmin');
        userCollection3
          .where('uid', '==', userID)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserName(userData.Name);
              setContact(userData.Contact);
              setAddress(userData.Address);
              setEmaill(userData.Email);
            
            });
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });

          const fetchData = async (uid) => {
            try {
                 const querySnapshot = await firebase.firestore()
                .collection('userBooking')
                .where('LandLord', '==', uid)
                .where('Status', '==', 'Accept')
            
                .get(); 
      
              const locationCounts = {};
      
              querySnapshot.forEach((doc) => {
                const location = doc.data().Town;
      
    
                if (location in locationCounts) {
                  locationCounts[location]++;
                } else {
                  locationCounts[location] = 1;
                }
              });
      
              // Convert the locationCounts object to an array of objects
              const locationsArray = Object.entries(locationCounts).map(([Town, count]) => ({
                Town,
                count,
              }));
      
              setLocations(locationsArray);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
      fetchUserImages();
fetchData();

    }, [userID,id]);
    
    



    
    
    
    const pieChartData = locations.map((locationData) => ({
      id: locationData.Town,
      value: locationData.count,
      label: locationData.Town,
    }));

      
  
  

  const available2 = parseInt(available)-1;
  
const handleBooking =async()=>{
   navigate = ('/user_book')
}
const handleRate = ()=>{
    setShow2(true);
}
const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();

      const db = firebase.firestore();
      const ratingsRef = db.collection('landlordData');

  switch(rating){
    case 5:
        await ratingsRef.doc(id).update({ Rate5: firebase.firestore.FieldValue.increment(1) });
        break;
    case 4: 
          await ratingsRef.doc(id).update({ Rate4: firebase.firestore.FieldValue.increment(1) });
          break;
    case 3:
        await ratingsRef.doc(id).update({ Rate3: firebase.firestore.FieldValue.increment(1) });
        break;
    case 2:
        await ratingsRef.doc(id).update({ Rate2: firebase.firestore.FieldValue.increment(1) });
        break;
    case 1:
        await ratingsRef.doc(id).update({ Rate1: firebase.firestore.FieldValue.increment(1) });
        break;
  }
 
  };
const handleReview=async()=>{
 handleShow3(true)
}
 const handleComment =async(e)=>{
  e.preventDefault();
try {
  await firebase.firestore().collection('userComments').add({
    Comments: comment,
    Name: userName20,
    Email: userEmail20,
    uid:currentUser1,
    LandlordID:userID,
    Photo:photo20,
  });


  setComment('');
} catch (error) {
  console.error('Error adding comment: ', error);
}

 }

  return (
<>
<br />
<UserNavbar />

<head>
                                <meta charset='utf-8' />
                                <meta name='viewport' content='width=device-width, initial-scale=1' />
                                <link href='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css' rel='stylesheet' />
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                                <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css' rel='stylesheet' />
                                <style></style>
                                <script type='text/javascript' src=''></script>
                                <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js'></script>
                                <script type='text/javascript' src='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js'></script>
                            </head>
                            <div class="container">
                              <br />
                              <h1 class="text-center">{user.Name}</h1>
                            <div class="col-md text-right">
                               <Link to = {`/user_booking/${id}`} >
                        <button  class="btn btn-primary mb-4 mr-1">Inquire Now</button>
                       </Link>
                       <Link to = {`/user_location/${id}`} >
                       <a class="btn btn-primary mb-4 mr-1" href="/user_location" >
                    Location
                </a>
                       </Link>
              
                       <button  class="btn btn-primary mb-4 mr-1" onClick={handleRate}>Rate</button>
            </div>
<div class="row">
    <div class="col-lg-4">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">Owner's Information</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-meeting-info">
                            <span class="widget-49-pro-title"></span>
                            <span class="widget-49-meeting-time"></span>
                        </div>
                    </div>
                    <ol class="widget-49-meeting-points">
                    <li class="widget-49-meeting-item" style ={{color:"black"}}><span>Name:      {name}</span></li>
                    <li class="widget-49-meeting-item" style ={{color:"black"}}><span>Contact:      {contact}</span></li>
                    <li class="widget-49-meeting-item" style ={{color:"black"}}><span>Email:      {email}</span></li>
                    <li class="widget-49-meeting-item" style ={{color:"black"}}><span>Address:      {address}</span></li>
                    </ol>
                 
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">Amenities</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-meeting-info">
                        </div>
                    </div>
                    {aminity.map((aminities, index)=>{
                      return(
                             <div>
        
  
                        <li class="widget-49-date-day"><span>{aminities}</span></li>
         
          
                              </div>
                      )
                    })}
                   
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">Available Slot</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-date-success">
                            <span class="widget-49-date-day">{available2}</span>
                        </div>
          
                    </div>  
                  
            
                </div>
            </div>
      
        </div>
        
    </div>

    <div class="col-lg-4">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">Price</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-date-success">
                            <span class="widget-49-date-day">₱{user.Price}</span>
                        </div>
          
                    </div>  
                  
            
                </div>
            </div>
      
        </div>
    </div>

    <div class="col-lg-5">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">People in the Room</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-meeting-info">
                            <span class="widget-49-pro-title"></span>
                            <span class="widget-49-meeting-time"></span>
                        </div>
                    </div>
                 
                    <PieChart
  series={[
    {
      data: pieChartData,
    },
  ]}
  width={400}
  height={200}
/>
                 
                </div>
            </div>
        </div>
    </div>


    
</div>
</div>



  <body oncontextmenu='return false' class='snippet-body flex-column d-flexs flex-md-row-reverse'>
                            <section class="pt-5 pb-5 d-flex ">
                            <div class="container">
                            <h1 class="text-center">Photos</h1>
    
    <div class="row">
        <div class="row row-cols-1 row-cols-md-3 g-1 py-5">
          
       
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
    </div>
</section>
 <script type='text/javascript'></script>

                            </body>


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
  <div className="rating-container">
      <h2>Rate This:
       
      </h2>
    
      {[1, 2, 3, 4, 5].map((value) => (
        <label key={value}>
          <input
            type="radio"
            name="rating"
            value={value}
            onClick={() => handleRatingChange(value)}
          />
          <FaStar
            className="star"
            color={value <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
            size={25}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
          />
        </label>
      ))}
      <br />
      <br />
      <br />
      <button className="submit-button" onClick={handleSubmitRating} disabled={submitted}>
        {submitted ? 'Rating Submitted' : 'Submit Rating'}
      </button>
    </div>

        </form>
    
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          
        </Modal.Footer>

      </Modal>

    

      <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center mb-4">Rating</h2>
          {user && (
            <>
            
          Rate 5    <div className="progress mb-3">
                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${user.Rate5}%` }} aria-valuenow={user.Rate5} aria-valuemin="0" aria-valuemax="100">
                  Excellent(5)
                </div>
              </div>
              Rate 4
              <div className="progress mb-3">
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${user.Rate4}%` }} aria-valuenow={user.Rate4} aria-valuemin="0" aria-valuemax="100">
                  Good(4)
                </div>
              </div>
              Rate 3
              <div className="progress mb-3">
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${user.Rate3}%` }} aria-valuenow={user.Rate3} aria-valuemin="0" aria-valuemax="100">
                  Average(3)
                </div>
              </div>
              Rate 2
              <div className="progress mb-3">
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${user.Rate2}%` }} aria-valuenow={user.Rate2} aria-valuemin="0" aria-valuemax="100">
                  Poor(2)
                </div>
              </div>
              Rate 1
              <div className="progress">
                <div className="progress-bar bg-dark" role="progressbar" style={{ width: `${user.Rate1}%` }} aria-valuenow={user.Rate1} aria-valuemin="0" aria-valuemax="100">
                  Very Poor(1)
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  
      <div class="bg-light p-2">
                    <div class="d-flex flex-row align-items-start"><img class="rounded-circle" width="100" />
                    <textarea class="form-control ml-1 shadow-none textarea"  value = {comment} required onChange = {(e) =>setComment(e.target.value) }></textarea>
                    </div>
                    <div class="mt-1 text-right">
                      <button class="btn btn-primary btn-sm shadow-none" type="button" onClick={handleComment}>Post comment</button>
                      <button class="btn btn-outline-primary btn-sm ml-1 shadow-none" type="button">Cancel</button>
                      </div>
                </div>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous" />
                <div class="container">
                  <div class="row">
             <div class="col-md-8">
           <div class="media g-mb-30 media-comment">
            {commentData.map((user)=>{
           return(
               <div>
                <img class="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15" src={user.Photo} alt="Image Description" />
              <div class="media-body u-shadow-v18 g-bg-secondary g-pa-30">
               <div class="g-mb-15">
                <h5 class="h5 g-color-gray-dark-v1 mb-0">{user.Name}</h5>
               </div>
               <p>{user.Comments}</p>


</div>
          </div>
       )
          })}
    
</div>
                
    

    </div>
        </div>
    </div>




<Footer />
</>
  )
}

export default UserView