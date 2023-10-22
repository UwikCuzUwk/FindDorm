import React,{useEffect,useState} from 'react'
import './UserView.css'
import { auth, firestore, storage} from '../../../Database/Database';
import firebase from 'firebase/compat/app'
import { addDoc, collection, deleteDoc, getDocs, doc, put} from "firebase/firestore"; 
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../UserNavbar/UserNavbar';
import { Link } from 'react-router-dom';
import { Button,Modal,Input } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';





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
    const [totalRating, setTotalRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
      const fetchUserImages = async () => {
        try {
          const userRef = firestore.collection('landlordData').doc(id); // Replace 'yourUserID' with the actual user ID
          const doc = await userRef.get();
  
          if (doc.exists) {
            const data = doc.data();
            setUserItems(data.Link || []);
            setUser(data)
          } else {
            console.log('No such document');
          }
        } catch (error) {
          console.error('Error fetching data from Firestore:', error);
        }
      };
  
      fetchUserImages();
    }, []);
 
    


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


  return (
<>
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
                            <body oncontextmenu='return false' class='snippet-body flex-column d-flexs flex-md-row-reverse'>
                            <section class="pt-5 pb-5 d-flex ">
                            <div class="container">
    <h1 class="text-center">{user.Name}</h1>
    <div class="col-md text-right">
                <a class="btn btn-primary mb-4 mr-1" href="/user_location" >
                    Location
                </a>
                <Link to = {`/user_booking/${id}`} >
                        <button  class="btn btn-primary mb-4 mr-1">Book Now</button>
                       </Link>
                       <button  class="btn btn-primary mb-4 mr-1" onClick={handleRate}>Rate</button>
            </div>
    <div class="row">
        <div class="row row-cols-1 row-cols-md-3 g-1 py-5">
          
       
        {userItem.map((imageLink, index)=>{
                return(
                  <div class="col">
                  <div class="card">
                      <img src={imageLink} class="card-img-top" alt="..." />
                      <div class="card-body">
                          <h5 class="card-title">{user.Name}
                    </h5>
                          <p class="card-text">{user.Message}</p>
                      </div>
                      <div class="mb-5 d-flex justify-content-around">
                          <h3>₱{user.Price}</h3>
                         
                      </div>
                      <a href="#" class="delete"onClick={handleReview} title="Rating" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">rate_review</i></a>
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


</>
  )
}

export default UserView