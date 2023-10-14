import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from 'react';
import { Button,Modal,Input } from 'react-bootstrap';
import AdminNavbar from "../Navbar/AdminNavbar";
import {auth, firestore} from '../../../Database/Database'
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

 
function AdminAdduser() {
 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] =useState('');
    const [address, setAddress] = useState('');
    const [contactno, setContactno] = useState('');
    const [user, setUser] = useState([]);
    const [id,setId] =useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=> {

  
    const fetchUser = async(e) =>{
        try{
            const userDataCollection = await firestore.collection("userAdmin").get();
            const userData = userDataCollection.docs.map((doc)=> doc.data());
            setUser(userData)
        }catch(error){
            console.error("Error fetching user", error.message);
        }

    }
    fetchUser();
  
}, [])




    const handleAddRecord = async(e)=>{
    e.preventDefault();
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );

        console.log("User created successfully!");
  

        await firestore.collection("userAdmin").doc(userCredential.user.uid).set({
          uid: userCredential.user.uid,
          Email: userCredential.user.email,
          Name: name,
          Contact: contactno,
          Address:address,
          isAdmin: "isAdmin",
        });
        setShow(false);
       
      } catch (error) {
        console.error("Error creating user:", error.message);
      }
    };
    const handleDelete = async(uid) =>{
       try{
        const deleteVal =  doc(firestore,"userAdmin",uid)
        await deleteDoc(deleteVal)
        toast.success('Deleted!', 
        {position: toast.POSITION.TOP_CENTER})
       }catch(error){
        toast.error('Error !', error.message, 
        {position: toast.POSITION.TOP_CENTER})
       }
           

    }
    const handleEdit = async(uid, Name, Address, Contact, Email) =>{
        try{
       setName(Name)
       setAddress(Address)
       setContactno(Contact)
       setEmail(Email)
       setShow1(true)
   setId(uid)
        }catch(error){
   
        }
     }
const handleUpdate =async()=>{
  try{
    const updateData = doc(firestore,"userAdmin",id)
        await updateDoc(updateData,{Name:name, Address:address, Contact:contactno, Email:email})
        setShow1(false)
  }catch(error){
    toast.error('Error', error.message, 
    {position: toast.POSITION.TOP_CENTER})

  }
}
const handleSearch =async()=>{
 setShow2(true);
  if (searchTerm.trim() !== '') {
    // Perform the Firebase search query here
    firestore
      .collection('userAdmin')
      .where('Name', '==', searchTerm)
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setSearchResults(data);
        console.log(data)
      
      })
      .catch((error) => {
        toast.error('Error !', error.message, 
        {position: toast.POSITION.TOP_CENTER})
  
      });
  } else {
    setSearchResults([]);
  }
}

    


  return (

<>
<AdminNavbar />
       <div class="container ">

            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
          <div class="row ">
           
           <div class="col-sm-3 mt-5 mb-4 text-gred">
              <div className="search">
                <form class="form-inline">
                 <input class="form-control mr-sm-2" type="search"   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Account" aria-label="Search"/>
              <br />
                  <Button variant = "primary"   onClick={handleSearch} >Search</Button>
                </form>
              </div>    
              </div>  
              <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2><b>Account Details</b></h2></div>
              <div class="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
              <Button variant="primary" onClick={handleShow}>
                Add new Account
              </Button>
             </div>
           </div>  
            <div class="row">
                <div class="table-responsive " >
                 <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name </th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Email </th>
                
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                  
                           {user.map((users, index)=>{
                            return(
                          <tr key = {users.uid} >
                             <td>{index + 1}</td>
                               <td>{users.Name}</td>
                               <td>{users.Address}</td>
                               <td>{users.Contact}</td>
                               <td>{users.Email}</td>

                               <td>
                              
                                <a href="#" class="edit" onClick={()=>handleEdit(users.uid, users.Name, users.Address,  users.Contact, users.Email    )} title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                                <a href="#" class="delete"onClick={()=>handleDelete(users.uid)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                                 
                            </td>
                            </tr>
                            
                            )
                          
                            })}
                             <td colSpan={7}>No Account </td>
                             
                    </tbody>
                </table>
            </div>   
        </div>  
        <div className="model_box">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Record</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Name" value = {name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div class="form-group mt-3">
                    <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Address" value = {address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div class="form-group mt-3">
                    <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Contact No" value = {contactno} onChange={(e) => setContactno(e.target.value)} />
                </div>
                <div class="form-group mt-3">
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email" autoComplete="false" value = {email} onChange = {(e) =>setEmail(e.target.value)}  />
                </div>
             
                <div class="form-group mt-3">
                    <input type="password" class="form-control" id="password" placeholder="Password"  autoComplete="false"  value = {password} onChange={(e) =>setPassword(e.target.value)}/>
                </div>
                
                  <button type="submit" class="btn btn-success mt-4" onClick={handleAddRecord}>Add Record</button>
                </form>
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
          <Modal.Title>Result</Modal.Title>
        </Modal.Header>
            <Modal.Body >
  <form> 
            <div class="row">
                <div class="table-responsive " >
                 <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name </th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Email </th>
                
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                  
                           {searchResults.map((users, index)=>{
                            return(
                          <tr key = {users.uid} >
                             <td>{index + 1}</td>
                               <td>{users.Name}</td>
                               <td>{users.Address}</td>
                               <td>{users.Contact}</td>
                               <td>{users.Email}</td>

                               <td>
                               
                                <a href="#" class="edit" onClick={()=>handleEdit(users.uid, users.Name, users.Address,  users.Contact, users.Email    )} title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
                                <a href="#" class="delete"onClick={()=>handleDelete(users.uid)} title="Delete" data-toggle="tooltip" style={{color:"red"}}><i class="material-icons">&#xE872;</i></a>
                                 
                            </td>
                            </tr>
                            
                            )
                          
                            })}
                             <td colSpan={7}>No Account </td>
                             
                    </tbody>
                </table>
            </div>   
        </div>  

        </form>
    
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      
  







       </div>  
       <div className="model_box">
      <Modal
        show={show1}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Record</Modal.Title>
        </Modal.Header>
            <Modal.Body>
            <form>
                <div class="form-group">
                    <input type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Name" value = {name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div class="form-group mt-3">
                    <input type="text" class="form-control" id="address" aria-describedby="emailHelp" placeholder="Address" value = {address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <div class="form-group mt-3">
                    <input type="text" class="form-control" id="contact" aria-describedby="emailHelp" placeholder="Contact No" value = {contactno} onChange={(e) => setContactno(e.target.value)} />
                </div>
                <div class="form-group mt-3">
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email"  value = {email} onChange = {(e) =>setEmail(e.target.value)}  />
                </div>
             
                
                  <button type="submit" class="btn btn-success mt-4" onClick={handleUpdate}>Update Record</button>
                </form>
            </Modal.Body>
 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>

      
  

       </div>  


      </div>    
      </div>  
      < ToastContainer />
      </>
  );
}
 
export default AdminAdduser;