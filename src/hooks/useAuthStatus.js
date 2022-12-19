import React from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const isMounted = React.useRef(true)
  
  React.useEffect(() => {
    if (isMounted) {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)
        }
        setLoading(false)
      })
    }

    return () => isMounted.current = false
  }, [isMounted])

  return {loggedIn, loading}
}