import React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as PersonOutline} from '../assets/svg/personOutlineIcon.svg'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true
    }
  }

  return (
    <footer className='navbar'>
      <nav className='navbarNav'>
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <ExploreIcon 
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} 
              width='36px' 
              height='36px' 
            />
            <p 
              className={
                pathMatchRoute('/') 
                ? 'navbarListItemNameActive' 
                : 'navbarListItemName'
              }
            >
              Explore
            </p>
          </li>

          <li className="navbarListItem" onClick={() => navigate('/offers')}>
            <OfferIcon 
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} 
              width='36px' 
              height='36px' 
            />
            <p
              className={
                pathMatchRoute('/offers') 
                ? 'navbarListItemNameActive' 
                : 'navbarListItemName'
              }
            >
              Offers
            </p>
          </li>

          <li className="navbarListItem" onClick={() => navigate('/profile')}>
            <PersonOutline 
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} 
              width='36px' 
              height='36px' 
            />
            <p
              className={
                pathMatchRoute('/profile') 
                ? 'navbarListItemNameActive' 
                : 'navbarListItemName'
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}