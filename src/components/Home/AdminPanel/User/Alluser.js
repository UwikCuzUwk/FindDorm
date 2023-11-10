import React, { useState, useEffect } from 'react';
import AdminNavbar from '../Navbar/AdminNavbar'
import firebase from 'firebase/compat/app'

function Alluser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
  
      const db = firebase.firestore();
  

      const usersCollection = db.collection('user');
  
  
      const fetchData = async () => {
        try {
          const snapshot = await usersCollection.get();
          const usersData = snapshot.docs.map((doc) => doc.data());
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

  return (
    <>
    <AdminNavbar />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <div class="container">
<div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
<div class="row">

<div class="col-sm-3 mt-5 mb-4 text-gred">
  <div className="search">
    <form class="form-inline">
    </form>
  </div>    
  </div>  
  <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-center" style={{color:"green"}}><h2>User Information</h2></div>
</div>  
<div class="row">
    <div class="table-responsive " >
     <table class="table table-striped table-hover table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>Name </th>
                <th>Email </th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Address</th>
         
            
            </tr>
            {users.map((users, index)=>{
                return(
              <tr key ={users.uid} >
                 <td>{index + 1}</td>
                   <td>{users.Name}</td>
                   <td>{users.Email}</td>
                  <td>{users.Contact}</td>
                  <td>{users.Gender}</td>
                  <td>{users.Street + " " + users.Barangay + " " + users.Town + " " + users.City}</td>
               
          
                </tr>
                
                )
              
                })}
                 <td colSpan={7}>No User</td>




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

export default Alluser