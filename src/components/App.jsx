import React from 'react'
import {ToastContainer} from 'react-toastify'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Navbar, PrivateRoute} from '../components'
import {
  Explore, 
  Category,
  Offers, 
  Profile, 
  Signin, 
  Signup,
  ForgotPass, 
  CreateListing,
  Listing,
  Contact,
  EditListing
} from '../pages/index'
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/category/:categoryName' element={<Category/>} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPass />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/edit-listing/:listingId' element={<EditListing />} />
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          <Route path='/contact/:landlordId' element={<Contact />} />
        </Routes>
        
        <Navbar />
      </BrowserRouter>

      <ToastContainer />
    </React.Fragment>
  )
}