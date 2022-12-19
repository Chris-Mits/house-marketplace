import React from 'react'
import {v4 as uuidv4} from 'uuid'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import {Spinner} from '../components'
import shareIcon from '../assets/svg/shareIcon.svg'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const formatCurr = curr => curr.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

export const Listing = () => {
  const [listing, setListing] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [shareLinkCopied, setShareLinkCopied] = React.useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  React.useEffect(() => {
    (async() => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists()) {
        setListing(docSnapshot.data())
        setLoading(false)
      }
    })()
  }, [navigate, params.listingId])

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareLinkCopied(true)
    setTimeout(() => setShareLinkCopied(false), 2000)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      <Swiper 
        style={{height: 400}}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1} 
        pagination={{clickable: true}}
        navigation
      >
        {listing.imageURLS.map(imageURL => (
          <SwiperSlide key={uuidv4()}>
            <div 
              className='swiperSlideDiv' 
              style={{background: `url(${imageURL}) center / cover no-repeat`}}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='shareIconDiv' onClick={handleShareLink}>
        <img src={shareIcon} alt='Share' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name}
          {' - '}
          {
            listing.offer 
            ? formatCurr(listing.discountedPrice) 
            : formatCurr(listing.regularPrice)
          }€
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type}</p>
        {listing.offer && (
          <p className="discountPrice">
            {listing.regularPrice - listing.discountedPrice}€ Discount
          </p>
        )}
        <ul className='listingDetailsList'>
          <li>{listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}</li>
          <li>{listing.bathrooms} Bathroom{listing.bathrooms > 1 && 's'}</li>
          <li>{listing.parking && 'Has Parking Spot'}</li>
          <li>{listing.furnished && 'Recently Furnished'}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        
        <div className='leafletContainer'>
          <MapContainer 
            style={{height: '100%', width: '100%'}}
            center={[listing.geoLocation.lat, listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <Marker position={[listing.geoLocation.lat, listing.geoLocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        
        {auth.currentUser?.uid !== listing.userRef && (
          <Link 
            className='primaryButton' 
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}