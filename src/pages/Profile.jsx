import React from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {getAuth, updateProfile, updateEmail} from 'firebase/auth'
import {
  doc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc
} from 'firebase/firestore'
import {toast} from 'react-toastify'
import {db} from '../firebase.config'
import {ListingItem} from '../components'
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

export const Profile = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [listings, setListings] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [changeDetails, setChangeDetails] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name, email} = formData

  React.useEffect(() => {
    (async() => {
      const listingsRef = collection(db, 'listings')
      const q = query(
        listingsRef, 
        where('userRef', '==', auth.currentUser.uid), 
        orderBy('timestamp', 'desc')
      )
      const querySnapshot = await getDocs(q)

      let listings = []
      querySnapshot.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    })()
  }, [auth.currentUser.uid])
  
  const handleLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const handleSubmit = async () => {
    try {
      auth.currentUser.displayName !== name && (
        // Update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name
        })
      )

      auth.currentUser.email !== email && (
        await updateEmail(auth.currentUser, email)
      )
      
      // Update in firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name: name,
        email: email
      })

      toast.success('Successfully updated profile')
    } catch (error) {
      toast.error('Could not update profile')
    }
  }

  const handleChangeDetails = () => {
    changeDetails && handleSubmit()
    setChangeDetails(prevState => !prevState)
  }

  const handleChange = (e) => {
    setFormData(prevState => {
      return {
        ...prevState,
        [e.target.id]: e.target.value
      }
    })
  }

  const handleListingDelete = async(listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(listing => listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Listing succesfully deleted!')
    }
  }

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button 
          className='logOut' 
          type='button' 
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={handleChangeDetails}>
            {changeDetails ? 'Done' : 'Update'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input 
              id='name' 
              type="text" 
              className={!changeDetails ? 'profileName' : 'profileNameActive'} 
              disabled={!changeDetails}
              value={name}
              onChange={handleChange}
            />
            <input 
              id='email' 
              type="email" 
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
              disabled={!changeDetails}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='Home' />
          <p>Sell or Rent your home</p>
          <img src={arrowRightIcon} alt='Arrow Right' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map(listing => {
                return (
                  <ListingItem 
                    key={listing.id} 
                    id={listing.id}
                    listing={listing.data} 
                    onDelete={() => handleListingDelete(listing.id)}
                    onEdit={(listingId) => navigate(`/edit-listing/${listingId}`)}
                  />
                )
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}