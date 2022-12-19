import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {OAuth} from '../components/index'

export const Signin = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  })
  const {email, password} = formData
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error('Invalid User Credentials')
      console.log(error)
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
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

            <div className="signInBar">
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </button>
            </div>       
          </form>

          <OAuth />
          <Link to='/sign-up' className='registerLink'>
            Don't have an account? <u>Sign Up Instead</u>
          </Link>
        </main>
      </div>
    </>
  )
}