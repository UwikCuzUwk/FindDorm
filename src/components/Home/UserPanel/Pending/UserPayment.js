import React, {useEffect,useState}from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import { useParams, Link} from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { auth, firestore } from '../../../Database/Database'


function UserPayment() {
    const {id} = useParams();
    const [userItem, setUserItems]= useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [user, setUser] = useState('');
    const [userData ,setUserData ] = useState([]);


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
              Balance:data.Balance,
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





  return (
   <>
   <UserNavbar />
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
                <th>Balance </th>
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
                 <td>{users.Balance}</td>

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



   </>
  )
}

export default UserPayment