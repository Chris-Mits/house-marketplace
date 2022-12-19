import React from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'

export const Contact = () => {
  const [message, setMessage] = React.useState('')
  const [landlord, setLandlord] = React.useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useParams()

  React.useEffect(() => {
    (async() => {
      const docRef = doc(db, 'users', params.landlordId)
      const docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists()) {
        setLandlord(docSnapshot.data())
      } else {
        toast.error('Could not get landlord data')
      }
    })()
  }, [params.landlordId])

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>Message</label>
              <textarea 
                id='message' 
                className='textarea' 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <a 
              href={`mailto:${landlord?.email}?subject=${searchParams.get('listingName')}&body=${message}`}
              target='_blank'
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}