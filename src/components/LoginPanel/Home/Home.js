import React from 'react'
import Navbar from '../../Navbar/Navbar'
import logo from '../Image/13027.jpg'
import './Home.css'

function Home() {
  return (
   <>
   <Navbar />
   <section id="hero" class="d-flex align-items-center">
   <div class="container">
      <div class="row">
        <div class="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
          <h1>DormiFind Make Easy to find Room </h1>
          <h2>We are here to provide solution for finding room in online.</h2>
          <div class="d-flex justify-content-center justify-content-lg-start">
            <a href="/login_page" class="btn-get-started scrollto">Get Started</a>
            
          </div>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
          <img src={logo} class="img-fluid animated" alt="" />
        </div>
      </div>
    </div>
    </section>

   </>
  )
}

export default Home
