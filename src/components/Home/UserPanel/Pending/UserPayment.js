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
    const [userData , setUserData] = useState([]);


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
 const handleDownload =async ()=>{
alert("and pogi ni mikko")
 }



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
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2>Current Payment</h2></div>     
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
          
                 
                   <Link to ={`/user_download/${users.uid}`}>
                   <a href="#" class="delete" title="Download" data-toggle="tooltip" style={{color:"green"}}><i class="material-icons">file_download</i></a>
                   </Link>
                   </td>
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