import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app'
import Navbar from '../../Navbar/Navbar';


function HomeLocation() {
  const [location, setLocation] = useState('');
  const [documentData, setDocumentData] = useState(null);
  const {id} = useParams();
const [name, setName] = useState('');
const [street, setSStreet] =useState('');
const [barangay, setBarangay] = useState('');
const [town, setTown] = useState('');
const [city, setCity] = useState('');
const [userLocation, setUserLocation] = useState('');
const [currentLocation, setCurrentLocation] = useState('');
const [destination, setDestination] = useState('');

useEffect(() => {
  const collectionRef = firebase.firestore().collection('landlordData'); // Replace with your actual collection name

  // Fetch the document by ID and only retrieve the 'name' field
  collectionRef
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const documentData = doc.data();
        const Street = documentData.Street;
        const Barangay = documentData.Barangay;
        const Town = documentData.Town;
        const City = documentData.City;


        setSStreet(Street);
        setBarangay(Barangay);
        setTown(Town);
        setCity(City)
        setLocation(Street + " " + Barangay + " " + Town + " " + City)
        setDestination(Street + " " + Barangay + " " + Town + " " + City)
     // Replace 'name' with the actual field name
     
      } else {
        // Document with the specified ID does not exist
        console.log('Document not found');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
}, [id]); // Add any dependencies you need here




  
  const handleOpenGoogleMaps = () => {
    if (location) {
      // Construct a Google Maps URL with the user-specified location
      const mapsURL = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
      
      // Open Google Maps in a new tab or window
      window.open(mapsURL, '_blank');
    } else {
      // Handle the case where the location input is empty
      alert('Please enter a location before opening Google Maps.');
    }
  }
  const handleOpenGoogleMaps1 = () => {
    if (currentLocation && destination) {
      // Construct a Google Maps URL with the user-specified current location and destination
      const mapsURL = `https://www.google.com/maps/dir/${encodeURIComponent(currentLocation)}/${encodeURIComponent(destination)}`;
      
      // Open Google Maps in a new tab or window
      window.open(mapsURL, '_blank');
    } else {
      // Handle the case where the location inputs are empty
      alert('Please enter both current location and destination before opening Google Maps.');
    }
  }
  return (

    <div>
<Navbar />
<section class="bg-light py-5 py-xl-6">
  <div class="container mb-5 mb-md-6">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 text-center">
        <h2 class="mb-4 display-5">Location</h2>
        <p class="text-secondary mb-4 mb-md-5">Get the Location</p>
        <hr class="w-50 mx-auto mb-0 text-secondary" />
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-lg-center">
      <div class="col-12 col-lg-9">
        <div class="bg-white border rounded shadow-sm overflow-hidden">
          <form action="#!">
            <div class="row gy-4 gy-xl-5 p-4 p-xl-5">
              <div class="col-12">
                <label for="fullloclocationaname" class="form-label">Location<span class="text-danger">*</span></label>
                <input type="text"  disabled class="form-control" id="location" required  value = {location}
        onChange={(e) => setLocation(e.target.value)}/>
              </div>
              <div class="col-12">
                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit" onClick={handleOpenGoogleMaps}>Get the Location</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-light py-5 py-xl-6">
  <div class="container mb-5 mb-md-6">
    <div class="row justify-content-md-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6 text-center">
        <h2 class="mb-4 display-5">Find the Location</h2>
        <p class="text-secondary mb-4 mb-md-5"></p>
        <hr class="w-50 mx-auto mb-0 text-secondary" />
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row justify-content-lg-center">
      <div class="col-12 col-lg-9">
        <div class="bg-white border rounded shadow-sm overflow-hidden">
          <form action="#!">
            <div class="row gy-4 gy-xl-5 p-4 p-xl-5">
              <div class="col-12">
                <label for="fullloclocationaname" class="form-label">Destination<span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="location" required    value={currentLocation}
        onChange={(e) => setCurrentLocation(e.target.value)}/>
              </div>
              <div class="col-12">
                <label for="fullloclocationaname" class="form-label">Input Your Location<span class="text-danger">*</span></label>
                <input type="text"  disabled class="form-control" id="location" required     value={destination}
        onChange={(e) => setDestination(e.target.value)}/>
              </div>
              <div class="col-12">
                <div class="d-grid">
                  <button class="btn btn-primary btn-lg" type="submit" onClick={handleOpenGoogleMaps1}>Find Location</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}

export default HomeLocation;
