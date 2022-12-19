import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

export const OAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const {user} = result

      // Check for user
      const docRef = doc(db, 'users', user.uid)
      const docSnapshot = await getDoc(docRef)

      // If user doesnt exist, create user
      if (!docSnapshot.exists()) {
        await setDoc(
          doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            timestamp: serverTimestamp()
          }
        )
      }

      navigate('/')      
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }

  return (
    <div className='socialLogin'>
      <p>
        Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with
      </p>
      <button className='socialIconDiv' onClick={handleClick}>
        <img className='socialIconImg' src={googleIcon} alt="Google" />
      </button>
    </div>
  )
}