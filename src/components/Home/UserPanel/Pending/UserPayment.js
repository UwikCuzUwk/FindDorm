import React, {useEffect,useState}from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import { useParams, Link} from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { auth, firestore } from '../../../Database/Database'
import { Button,Modal} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function UserPayment() {
    const {id} = useParams();
    const [userItem, setUserItems]= useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [user, setUser] = useState('');
    const [userData ,setUserData ] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [landlordId, setLandlordID] = useState('');
    const [adson, setUseAdsOn] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    useEffect(() => {
   
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user.uid);
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
          setLandlordID(data.Landlord);
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
    const fetchAddson = async () => {
      try {
        const db = firebase.firestore();
        const userAddson = await db.collection('userAddson').where('uid', '==', currentUser).where('Landlord', '==', landlordId).get();
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
    fetchUser();
  
  
  
    return () => unsubscribe();
  
    }, [currentUser,landlordId]);
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
            return {
              id: doc.id,
              Name: data.Name,
              CurrentDate: formattedTimestamp,
              Status: data.Status,
              nextBillingDate: formattedTimestamp1,
              DormName: data.DormName,
              PreviousBill: data.PreviousBill,
              Price:data.Price,
              totalPrice:data.totalPrice,
              Additional:data.Additional,
            };
          });
  
          // Sort the userDataArray by 'CurrentDate' in ascending order
          userDataArray.sort((a, b) => new Date(a.CurrentDate) - new Date(b.CurrentDate));
  
          setUserData(userDataArray);
        } catch (error) {
          console.error('Error fetching user items:', error);
        }
      };
  
      fetchUserItems();
    }, [id]);



    const handleAddsOn = () =>{
  setShow(true)

    }
const handleCheckboxChange = (e) => {
  const value = e.target.value;
    const updatedItems = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
    setSelectedItems(updatedItems);
}

const handleSaveToFirestore = async () => {
  const db = firebase.firestore();
    const querySnapshot = await db.collection('userAddson').where('uid', '==', currentUser).where('Landlord', '==', landlordId).get();
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    });

  try {
    await firestore.collection('userAddson').add({
      SelectedItems:selectedItems,
      uid:currentUser,
      Landlord:landlordId,
    });
    toast.success("Successfully Saved!")
    setSelectedItems([])
    console.log('Items saved to Firestore:', selectedItems);
  } catch (error) {
    console.error('Error saving to Firestore', error.message);
  }
};
const handleMyaddson = ()=>{
  setShow1(true)
}
  return (
   <>
   <UserNavbar />
   <link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8sh+WyCq0P/5WOa2JK6OqnmI1fDHtCl/D5iWfS"
  crossorigin="anonymous"
/>
   <Modal
  show={show}
  onHide={() => setShow(false)}
  dialogClassName="modal-lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Additional Gadgets/Appliances</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value="Laptop"
          id="checkboxLaptop"
          checked={selectedItems.includes('Laptop')}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label" htmlFor="checkboxLaptop">
          Laptop
        </label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value="Rice Cooker"
          id="checkboxRiceCooker"
          checked={selectedItems.includes('Rice Cooker')}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label" htmlFor="checkboxRiceCooker">
          Rice Cooker
        </label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value="Electric Kettle"
          id="checkboxElectricKettle"
          checked={selectedItems.includes('Electric Kettle')}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label" htmlFor="checkboxElectricKettle">
          Electric Kettle
        </label>
      </div>

      <button class="btn btn-success mt-2"   onClick={handleSaveToFirestore}>Save</button>
    
  </Modal.Body>
</Modal>

<Modal
  show={show1}
  onHide={() => setShow1(false)}
  dialogClassName="modal-lg"
>
  <Modal.Header closeButton>
    <Modal.Title>My addsOn</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div class="col-lg-7">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title">Additional Gadget/Appliances</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-meeting-info">
                        </div>
                    </div>
                    {adson.map((aminity) => (
  <div>
    <li class="widget-49-date-day">
      {aminity}
    </li>
  </div>
))}

                </div>
            </div>
        </div>
    </div>
    
  </Modal.Body>
</Modal>



   <div class="container ">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row ">

<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
  <Button variant = "primary" onClick={handleAddsOn} >Additional Gadgets/Appliances</Button>
    <form class="form-inline">
    </form>
    <br />
    <Button variant = "primary" onClick={handleMyaddson} >My AddsOn</Button>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2> Payment</h2></div>     
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
                <th>AddsOn </th>
                <th>Total </th>
                <th>Status </th>
           
            </tr>
            {userData.map ((users, index)=>{
                return(
              <tr key ={users.uid} >
                    <td>{index + 1}</td>
                    <td>{users.Name}</td>
                    <td>{users.PreviousBill}</td>
                  <td>{users.CurrentDate}</td>
                 <td>{users.nextBillingDate}</td>
                 <td>{users.DormName}</td>
                 <td>{users.Price}</td>
                 <td>{users.Additional}</td>
                 <td>{users.totalPrice}</td>

                    <td>{users.Status}</td>

                  
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No Payment </td>
                   



        </thead>
        <tbody>
            
      
              
                 
        </tbody>
    </table>
</div>   
</div>  


</div>

</div>


< ToastContainer />
   </>
  )
}

export default UserPayment