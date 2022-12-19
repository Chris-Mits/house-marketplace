import React from 'react'
import {Link} from 'react-router-dom'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

export const ForgotPass = () => {
  const [email, setEmail] = React.useState('')
  
  const handleChange = (e) => setEmail(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Reset email was sent')
    } catch (error) {
      toast.error('Could not sent reset email')
    }
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input 
            id='email' 
            className='emailInput'
            type="email" 
            placeholder='Email' 
            value={email} 
            onChange={handleChange}
          />
          <Link className='forgotPasswordLink' to='/sign-in'>
            Sign In
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#fff' width={34} height={34} />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}