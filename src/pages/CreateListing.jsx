import React from 'react'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {toast} from 'react-toastify'
import {Spinner} from '../components'
import {db} from '../firebase.config'

export const CreateListing = () => {
  const {VITE_GEOKEY, VITE_BASE_URL} = import.meta.env
  const [geoLocationEnabled, setGeoLocationEnabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0
  })
  const auth = getAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    // onAuthStateChanged returns a unsubscribe fn() we can use for cleanup.
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            userRef: user.uid
          }
        })
      } else {
        navigate('/sign-in')
      }
    })

    return unsubscribe
  }, [auth, navigate])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)

    let geoLocation = {}
    let location = ''

    if (formData.discountedPrice >= formData.regularPrice) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if (formData.images.length > 6) {
      setLoading(false)
      toast.error('The max number of images is 6')
      return
    }

    if (geoLocationEnabled) {
      const response = await fetch(encodeURI(VITE_BASE_URL + formData.address + VITE_GEOKEY))
      const data = await response.json()
      
      geoLocation.lat = data.features[1]?.properties.lat ?? 0
      geoLocation.lng = data.features[1]?.properties.lon ?? 0
      location = data.features[1]?.properties.formatted

      if (typeof location === 'undefined' || location === undefined) {
        setLoading(false)
        toast.error('Please enter a valid address')
        return
      }
    } else {
      geoLocation.lat = formData.latitude
      geoLocation.lng = formData.longitude
      location = formData.address
    }

    // Store image in firebase
    const storeImage = async(image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, 'images/' + fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(downloadURL => resolve(downloadURL))
          }
        )
      })
    }

    const imageURLS = await Promise
      .all([...formData.images].map(image => storeImage(image)))
      .catch(() => {
        setLoading(false)
        toast.error('There was an error. Images did not upload.')
        return
      })

    const formDataCopy = {
      ...formData,
      imageURLS,
      geoLocation,
      timestamp: serverTimestamp()
    }

    delete formDataCopy.images
    delete formDataCopy.address
    if (location) formDataCopy.location = location
    if (!formDataCopy.offer) delete formDataCopy.discountedPrice

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

    setLoading(false)
    toast.success('Listing is now live!')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const handleMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }

    if (e.target.value === 'false') {
      boolean = false
    }

    // Files treatment
    if (e.target.files) {
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          images: e.target.files
        }
      })
    }

    // Text/Booleans/Numbers treatment
    if (!e.target.files) {
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          [e.target.id]: boolean ?? e.target.value
        }
      })
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className="pageHeader">Create a listing</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className="formButtons">
            <button 
              id='type'
              className={formData.type === 'sale' ? 'formButtonActive' : 'formButton'} 
              type='button'
              value='sale'
              onClick={handleMutate}
            >
              Sell
            </button>
            <button 
              id='type'
              className={formData.type === 'rent' ? 'formButtonActive' : 'formButton'} 
              type='button'
              value='rent'
              onClick={handleMutate}
            >
              Rent
            </button>
          </div>

          <label htmlFor='name' className='formLabel'>Name</label>
          <input 
            id='name'
            className='formInputName' 
            type="text" 
            value={formData.name}
            onChange={handleMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input 
                id='bedrooms'
                className='formInputSmall' 
                type='number' 
                value={formData.bedrooms}
                onChange={handleMutate}
                max='50'
                min='1'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input 
                id='bathrooms'
                className='formInputSmall' 
                type='number' 
                value={formData.bathrooms}
                onChange={handleMutate}
                max='50'
                min='1'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking Spot</label>
          <div className='formButtons'>
            <button 
              id='parking'
              className={formData.parking ? 'formButtonActive' : 'formButton'} 
              type='button'
              value={true}
              onClick={handleMutate}
              maxLength='50'
              minLength='1'
            >
              Yes
            </button>
            <button 
              id='parking'
              className={
                !formData.parking && formData.parking !== null 
                ? 'formButtonActive' 
                : 'formButton'
              } 
              type='button'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button 
              id='furnished'
              className={formData.furnished ? 'formButtonActive' : 'formButton'} 
              type='button'
              value={true}
              onClick={handleMutate}
              maxLength='50'
              minLength='1'
            >
              Yes
            </button>
            <button 
              id='furnished'
              className={
                !formData.furnished && formData.furnished !== null 
                ? 'formButtonActive' 
                : 'formButton'
              } 
              type='button'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea 
            id='address'
            className='formInputAddress'
            value={formData.address}
            onChange={handleMutate}
            required
          />

          {!geoLocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input 
                  id='latitude'
                  className='formInputSmall'
                  type='number' 
                  value={formData.latitude}
                  onChange={handleMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input 
                  id='longitude'
                  className='formInputSmall'
                  type='number' 
                  value={formData.longitude}
                  onChange={handleMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button 
              id='offer'
              className={formData.offer ? 'formButtonActive' : 'formButton'} 
              type='button'
              value={true}
              onClick={handleMutate}
            >
              Yes
            </button>
            <button 
              id='offer'
              className={
                !formData.offer && formData.offer !== null 
                ? 'formButtonActive' 
                : 'formButton'
              } 
              type='button'
              value={false}
              onClick={handleMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input 
              id='regularPrice'
              className='formInputSmall'
              type='number'
              value={formData.regularPrice}
              onChange={handleMutate}
              max='750000000'
              min='50'
              required
            />
            {formData.type === 'rent' && (
              <p className='formPriceText'>€ / Month</p>
            )}
          </div>

          {formData.offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input 
                id='discountedPrice'
                className='formInputSmall'
                type='number'
                value={formData.discountedPrice}
                onChange={handleMutate}
                max='750000000'
                min='50'
                required
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>The first image will be the cover (max 6)</p>
          <input 
            id='images'
            className='formInputFile'
            type='file'
            accept='.jpg,.png,.jpeg'
            onChange={handleMutate}
            max='6'
            multiple
            required
          />

          <button 
            type='submit'
            className='primaryButton createListingButton'
          >
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}