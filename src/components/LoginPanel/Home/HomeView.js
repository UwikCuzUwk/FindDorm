import React,{useEffect,useState} from 'react'
import { firestore } from '../../Database/Database';
import firebase from 'firebase/compat/app'
import { addDoc, collection, deleteDoc, getDocs, doc, put, setIndexConfiguration} from "firebase/firestore"; 
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button,Modal,Input } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import Footer from '../../Navbar/Footer';
import Navbar from '../../Navbar/Navbar';
import Swal from 'sweetalert2';
import '../../Home/UserPanel/UserHome/UserHome.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function HomeView() {

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
    const [commentData, setCommentData] = useState([])
    const [dormName, setDormName] = useState('')
    const [sameRoom, setsameRoom] = useState([])

    useEffect(() => {
      const fetchUserImages = async () => {
        try {
          const userRef = firestore.collection('landlordData').doc(id); 
          const doc = await userRef.get();
  
          if (doc.exists) {
            const data = doc.data();
            setUserItems(data.Link || []);
            setUserID(data.uid);
            setUser(data)
            setAminity(data.Message|| [])
            setAvailable(data.Available || [])
           setDormName(data.Name)
         
          } else {
            console.log('No such document');
          }
        } catch (error) {
          console.error('Error fetching data from Firestore:', error);
        }
      };

      fetchUserImages();

    }, [id]);
   
        const userCollection30 = firebase.firestore().collection('userAdmin');
        userCollection30
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
      
          useEffect(() => {
         const db = firebase.firestore();
            db.collection('userBooking')
              .where('DormName', '==', dormName) 
              .where('Status', '==', 'Accept')
              .get()
              .then((querySnapshot) => {
                const retrievedData = [];
                querySnapshot.forEach((doc) => {
                  retrievedData.push({ id: doc.id, ...doc.data() });
                });
                setsameRoom(retrievedData);
              })
              .catch((error) => {
                console.error('Error getting documents: ', error);
              });
          }, [dormName]);

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
   
  const available2 = parseInt(available)-1;
  
const handleBooking =async()=>{
   navigate = ('/user_book')
}
const handleRate = ()=>{
   toast.error("Logged in first before you rate!")
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

const handleIquire = async () => {
 toast.error('Logged in first before you Inquire!');
}

  return (
<>< ToastContainer />

<br />
<Navbar />

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
                     
                        <button  class="btn btn-primary mb-4 mr-1" onClick={handleIquire}>Inquire Now</button>
                
                       <Link to = {`/home_location/${id}`} >
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
                    {aminity.map((aminities)=>{
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

    <div class="col-lg-4">
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
                 
                    {sameRoom.map((user) => (
  <div key={user.id}>
    <li className="widget-49-date-day">
      <span>
        <span style={{ color: "blue" }}>👤</span>
        {" - "}
        <span style={{ color: "black" }}>{user.Town + " " + user.City}</span>
      </span>
    </li>
  </div>
))}

                 
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

      <Modal
        show={show3}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Rating</Modal.Title>
        </Modal.Header>
            <Modal.Body >
  <form> 
  {user && (
    <>
 <span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star"></span>
<span class="fa fa-star"> = {user.Rate5}   <i class="material-icons">person</i></span>
<br />
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star"> = {user.Rate4}  <i class="material-icons">person</i></span>
<br />
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star"> = {user.Rate3}  <i class="material-icons">person</i></span>
<br />
<span class="fa fa-star checked"></span>
<span class="fa fa-star"> = {user.Rate2} <i class="material-icons">person</i></span>
<br />
<span class="fa fa-star"> = {user.Rate1} <i class="material-icons">person</i></span>
    </>
 

)}
        </form>
    
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
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

export default HomeView