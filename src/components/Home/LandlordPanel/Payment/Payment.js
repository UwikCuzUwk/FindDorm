import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import LandlordNavbar from '../Navbar/LandlordNavbar';
import firebase from 'firebase/compat/app';
import { firestore } from '../../../Database/Database';
import { Button,Modal,Input } from 'react-bootstrap';


function Payment() {
const {id} = useParams();
const [userItem, setUserItems]= useState([]);
const [currentUser, setCurrentUser] = useState('');
const [user, setUser] = useState('');
const [userData , setUserData] = useState([]);
const [name, setName] = useState('');
const [month, setMonth] = useState('');
const [show1, setShow1] = useState(false);
const handleClose1 = () => setShow1(false);
const handleShow1 = () => setShow1(true);


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


const fetchUserItems = async () => {
    try {
      const db = firebase.firestore();
      const itemsCollection = db.collection('userPayment');
      const querySnapshot = await itemsCollection.where('uid', '==', id).get();

      const userDataArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const { Name,  Month, Status, NextBilling } = data;
        const date = new Date(Month.seconds * 1000); 
        const formattedTimestamp = date.toLocaleString();
        const date1 = new Date(NextBilling.seconds * 1000); 
        const formattedTimestamp1 = date1.toLocaleString();
      
        return { id: doc.id, Name, Month: formattedTimestamp, Status, NextBilling:formattedTimestamp1};
      });

      setUserItems(userDataArray);
     
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };
  

  fetchUser();



  return () => unsubscribe();

  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const usersRef = db.collection('userBooking');

    // Use the provided userId to filter the document
    usersRef
      .where('uid', '==', id)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
          console.log(userData)
        } else {
          console.log('User not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

const handleAdddata = async()=>{
 setShow1(true)
}
const handleAdd = async(e)=>{
e.preventDefault();
const monthTimestamp = new Date(month); // Convert the user input month to a JavaScript Date object
monthTimestamp.setDate(monthTimestamp.getDate() + 30); // Calculate the next billing date

const db = firebase.firestore();
const usersRef = db.collection('userPayment'); // Replace 'users' with your Firestore collection name

usersRef
  .add({
    Name: userData.Name,
    Month: firebase.firestore.Timestamp.fromDate(new Date(month)),
    NextBilling: monthTimestamp,
    Status:'Not Paid',
    uid:userData.uid,
  })
  .then(() => {
    console.log('Data added to Firestore successfully');
    setName('');
    setMonth('');
  })
  .catch((error) => {
    console.error('Error adding data to Firestore:', error);
  });

}
const handleAccept =async(id)=>{
  const userRef = firestore.collection('userPayment').doc(id);
  userRef.update({Status:'Paid'})
  .then(()=>{
    console.log('Document status updated')
  }).catch((error)=>{
  console.log('Error updating Documents', error)
  })
}
const handleDecline =async(id)=>{
const userRef = firestore.collection('userPayment').doc(id);
userRef.update({Status:'Not Paid'})
.then(()=>{
  console.log('Document status updated')
}).catch((error)=>{
console.log('Error updating Documents', error)
})
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
    
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2>Monthly Payment</h2></div>     
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Payment Cash </th>
                <th>Month </th>
                <th>Next Billing </th>
                <th>Status </th>
                <th>Actions</th>
            </tr>
            {userItem.map ((users, index)=>{
                return(
              <tr key ={users.uid} >
                    <td>{index + 1}</td>
                    <td>{users.Name}</td>
                    <td>Cash</td>
                    <td>{users.Month}</td>
                    <td>{users.NextBilling}</td>
                    <td>{users.Status}</td>
          
             

                   <td>
                   <a href="#" class="delete" onClick={handleAdddata} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">create_new_folder</i></a>
                   <a href="#" class="delete"onClick={()=>handleAccept(users.id)} title="Accept" data-toggle="tooltip" style={{color:"green"}}> <i class="large material-icons">check</i></a>
                   <a href="#" class="delete"onClick={()=>handleDecline(users.id)} title="Decline" data-toggle="tooltip" style={{color:"red"}}> <i class="large material-icons">close</i></a>
                
                </td>
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Account </td>
                   



        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  


</div>

</div>
<Modal
        show={show1}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Billing</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <form>
                <div class="form-group mt-3">
                    <input type="date" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {month} onChange={(e) => setMonth(e.target.value)}/>
                </div>
               
                
                  <button type="submit" class="btn btn-success mt-4" onClick={handleAdd}>Add Billing</button>
                </form>
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>

  
  </>
  )
}

export default Payment
