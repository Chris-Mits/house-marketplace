import React from 'react'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {OAuth} from '../components/index'

export const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })
  const {name, email, password} = formData
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prevState => {
      const {id, value} = e.target
      
      return {
        ...prevState,
        [id]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(
        doc(db, 'users', user.uid), 
        formDataCopy
      )

      navigate('/')
    } catch (error) {
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Create your account</p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <input 
              id='name'
              type="text" 
              className='nameInput' 
              placeholder='Name'
              value={name}
              onChange={handleChange}
            />
            <input 
              id='email'
              type="email" 
              className='emailInput' 
              placeholder='Email'
              value={email}
              onChange={handleChange}
            />

            <div className="passwordInputDiv">
              <input 
                id='password'
                type={showPassword ? 'text' : 'password'} 
                className='passwordInput'  
                placeholder='Password'
                value={password}
                onChange={handleChange}
              />
              <img 
                src={visibilityIcon} 
                alt="Show password" 
                className="showPassword" 
                onClick={() => setShowPassword(prevState => !prevState)}
              />
            </div>

            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className="signUpBar">
              <p className='signUpText'>Sign Up</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </button>
            </div>       
          </form>

          <OAuth />
          <Link to='/sign-in' className='registerLink'>
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  )
}