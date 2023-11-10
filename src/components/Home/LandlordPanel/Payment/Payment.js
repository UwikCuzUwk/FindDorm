import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import LandlordNavbar from '../Navbar/LandlordNavbar';
import firebase from 'firebase/compat/app';
import { firestore } from '../../../Database/Database';
import { Button,Modal,Input } from 'react-bootstrap';
import Footer from '../../../Navbar/Footer';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';


function Payment() {
  const navigate = useNavigate();
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

const [show2, setShow2] = useState(false);
const handleClose2= () => setShow2(false);
const handleShow2 = () => setShow2(true);
const [userDatas, setUserDatas] = useState([])
const [userDatass, setUserDatass] = useState([])
const [currentID ,setCurrentId] = useState('')
const [userName, setUserName] = useState('')
const [userRoom, setUserRoom] = useState('')
const [userUID, setuserUID] = useState('')
const [nextbill ,setNextBill] = useState('')
const [cuurentBill ,setCurrentBill] = useState('')
const [roomPrice,setRoomPrice] = useState('')
const [balance, setBalance] = useState('')
const [roomID, setRoomID] = useState('')
const[currentMonth, setCurrentMonth] = useState('')

const [data,setData] = useState([]);
const [dormName, setDormName] = useState('')
const [landlordID ,setLandlordData] = useState('')  
const [messages, setMessages] = useState([])
const [dormName1, setDormName1] = useState('')
const [selectedValue, setSelectedValue] = useState('');
const [adson, setUseAdsOn] = useState([])
const [addPrice, setAddPrice] = useState('')
const [additionalPrice, setAdditional]= useState('');
const [totalPrice, setTotalPrice] = useState('')

useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
        fetchUserItems(user.uid);
        setCurrentId(user.uid)
        
      
      } else {
        setCurrentUser(null);
      }
    });

    const fetchUser = async(e) =>{
      try{
          const userDataCollection = await firestore.collection("landlordData").get();
          const userData = userDataCollection.docs.map((doc)=> doc.data());
          setUser(userData)
          setDormName(userData.Name)
      }catch(error){
          console.error("Error fetching user", error.message);
      }

  }


const fetchUserItems = async (uid) => {
    try {
      const db = firebase.firestore();
      const itemsCollection = db.collection('userPayment');
      const querySnapshot = await itemsCollection.where('uid', '==', id).where('Landlord','==',uid).get();

      const userDataArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        setLandlordData(data.Landlord)
        setDormName1(data.DormName)
        const { Name,  Month, Status, NextBilling,currentMonth} = data;
        const date = new Date(Month.seconds * 1000); 
        const formattedTimestamp = date.toLocaleString();
        const date1 = new Date(NextBilling.seconds * 1000); 
        const formattedTimestamp1 = date1.toLocaleString(); 
    
        return { id: doc.id, Name, Month: formattedTimestamp, Status, NextBilling:formattedTimestamp1, currentMonth};
      });

      setUserItems(userDataArray);
     
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };
  const fetchMessages = async () => {
    try {
      const userRef = firebase.firestore().collection('landlordData').where('uid','==',landlordID).where('Name','==',dormName1)
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
         setMessages(data.Message || []);
     
      } else {
        console.log('No such document');
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const fetchAddson = async () => {
    try {
      const db = firebase.firestore();
      const userAddson = await db.collection('userAddson').where('uid', '==', id).where('Landlord', '==', currentUser).get();
      const userAddsonData = userAddson.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          selectedItems: data.SelectedItems || [],
          // Add other properties as needed
        };
      });
  
      // Assuming you want to set the SelectedItems in the usr state
      const selectedItems = userAddsonData.flatMap((item) => item.selectedItems);
      setUseAdsOn(selectedItems || []);
  
      console.log(userAddsonData);
    } catch (error) {
      console.error("Error fetching userAddson data", error.message);
    }
  };
  fetchAddson();
  fetchMessages();
  fetchUser();
fetchUserItems();


  return () => unsubscribe();

  }, [dormName1,landlordID]);



  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const userPaymentRef = firestore.collection('userPayment');
        const querySnapshot = await userPaymentRef
          .where('uid', '==', id)
          .get();

        const userDataArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          const formattedTimestamp = data.CurrentDate?.seconds
            ? new Date(data.CurrentDate.seconds * 1000).toLocaleString()
            : 'N/A';

          const formattedTimestamp1 = data.nextBillingDate?.seconds
            ? new Date(data.nextBillingDate.seconds * 1000).toLocaleString()
            : 'N/A';
     setUserRoom(data.DormName)
     setuserUID(data.uid)
     setUserName(data.Name)
     setCurrentMonth(data.currentMonth)

          return {
            id: doc.id,
            Name: data.Name,
            CurrentDate: formattedTimestamp,
            Status: data.Status,
            nextBillingDate: formattedTimestamp1,
            DormName: data.DormName,
            PreviousBill: data.PreviousBill,
            Price:data.Price,
            Balance:data.Balance, 
            Additional:data.Additional,
            totalPrice:data.totalPrice,
          };
        });

        // Sort the userDataArray by 'CurrentDate' in ascending order
        userDataArray.sort((a, b) => new Date(a.CurrentDate) - new Date(b.CurrentDate));

        setUserDatas(userDataArray);
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };

    fetchUserItems();
  }, [id]);
  



  const handleChange = (e) => {
    setSelectedValue(e.target.value);
 };

const userInput = 1;
const seletedValue = data[userInput - 1];
console.log(seletedValue);
  

const handleAdddata = async(nextBillingDate,Status, Price)=>{
  setCurrentBill(nextBillingDate)
  setRoomPrice(Price)
  if(Status ==='Paid'){
    setShow1(true)
  }else{
    toast.error("Update the payment status first")
  }

}
const handleAdd = async(e)=>{
  e.preventDefault();
  const totalPrice = parseInt(addPrice) + parseInt(roomPrice);
  const currentMonth1 = new Date().getMonth() + 1;
  if(currentMonth === currentMonth1){
  toast.error("The User Already paid for this month")
  }else{
    const monthTimestamp = new Date(month); // Convert the user input month to a JavaScript Date object
monthTimestamp.setDate(monthTimestamp.getDate() + 30);


const db = firebase.firestore();
const usersRef = db.collection('userPayment'); // Replace 'users' with your Firestore collection name

usersRef
  .add({
    Name:userName,
    DormName:userRoom,
    PreviousBill:cuurentBill,
    CurrentDate:firebase.firestore.Timestamp.fromDate(new Date(month)),
    nextBillingDate: monthTimestamp,
    Status:'Not Paid',
    uid:userUID,
    Price:roomPrice,
    LandLord:currentUser,
    totalPrice:totalPrice,
    Additional:addPrice,
    currentMonth: currentMonth,
  })
  .then(() => {
   toast.success('Data added to Firestore successfully');
   
  })
  .catch((error) => {
    console.error('Error adding data to Firestore:', error);
  });

  }



}
const handlePaid =async(id, Status)=>{
  if(Status ==='Paid'){
toast.error("Already Paid")
  }else{
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Paid this!'
  }).then((result) => {
    if (result.isConfirmed) {
      const userRef = firestore.collection('userPayment').doc(id);
      userRef.update({Status:'Paid'})
      .then(()=>{
        console.log('Document status updated')
      }).catch((error)=>{
      console.log('Error updating Documents', error)
      })

      Swal.fire(
        'Paid!',
        'Successfully Paid.',
        'success'
      )
    }
  })
}
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
const handleSettled = async(id, Status, Price) =>{
setRoomPrice(Price)
setRoomID(id)
  setShow2(true)
}
const handleDelete = async(id)=>{
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
      db.collection('userPayment').doc(id)
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
const handleBalance = async(e)=>{
  e.preventDefault();
  const userRef = firestore.collection('userPayment').doc(roomID);
  userRef.update({Balance:balance, Status:"Settled"})
  .then(()=>{
    toast.success('Document Balance updated')
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
                <th>Previous Bill </th>
                <th>Month </th>
                <th>Next Billing </th>
                <th>Room Name </th>
                <th>Price </th>
                <th>AdsOn Price </th>
                <th>Total</th>
                <th>Status </th>
                <th>Actions</th>
            </tr>
            {userDatas.map ((user, index)=>{
                return(
              <tr key ={user.uid} >
                    <td>{index + 1}</td>
                    <td>{user.Name}</td>
                    <td>{user.PreviousBill}</td>
                    <td>{user.CurrentDate}</td>
       
                    <td style = {{color:'red'}}>{user.nextBillingDate}</td>
                    <td>{user.DormName}</td>
                    <td>{user.Price}</td>
                    <td>{user.Additional}</td>
                    <td>{user.totalPrice}</td>
                    <td>{user.Status}</td>
          
             

                   <td>
                   <a href="#" class="add" onClick={()=>handleDelete(user.id)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">delete_forever</i></a>
                   <a href="#" class="add" onClick={()=>handleAdddata(user.nextBillingDate, user.Status, user.Price)} title="Add Billing" data-toggle="tooltip" style={{color:"orange"}}><i class="material-icons">create_new_folder</i></a>
                   <a href="#" class="delete" onClick={()=>handlePaid(user.id, user.Status)} title="Payment" data-toggle="tooltip" style={{color:"orange"}}><i class="material-icons">attach_money</i></a>
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
                    <label>Last Bill</label>
                    <input type="text" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {cuurentBill}/>
                </div>
                <div class="form-group mt-3">
                    <input type="date" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {month} onChange={(e) => setMonth(e.target.value)}/>
                </div>
        <br />
                <label>Additional Gadget/Appliances</label>
      {adson.map((user)=>{
        return(
          <div>
             <div class="form-group mt-3">
                    <input type="text" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {user}  />
                </div>
          </div>
        )
      })}
      <div class="form-group mt-3">
                    <input type="text" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {addPrice} onChange={(e)=>setAddPrice(e.target.value)}/>
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

      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Balance</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <form>
            <div class="form-group mt-3">
                    <label>Price</label>
                    <input type="text" class="form-control" id="month" aria-describedby="emailHelp" placeholder="Month" value = {roomPrice}/>
                </div>
                <div class="form-group mt-3">
                    <input type="number" class="form-control" id="balance" aria-describedby="emailHelp" placeholder="Balance" value = {balance} onChange={(e) => setBalance(e.target.value)}/>
                </div>
               
                
                  <button type="submit" class="btn btn-success mt-4" onClick={handleBalance}>Balance</button>
                </form>
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>

  <Footer />
  < ToastContainer />
  </>
  )
}

export default Payment
