import React from 'react'
import {Link} from 'react-router-dom'
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

const formatCurr = curr => curr.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

export const ListingItem = ({listing, id, onDelete, onEdit}) => {
  return (
    <li className='categoryListing'>
      <Link 
        className='categoryListingLink'
        to={`/category/${listing.type}/${id}`}
      >
        <img 
          className='categoryListingImg'
          src={listing.imageURLS[0]} 
          alt={listing.name}  
        />

        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'>
            {listing.location}
          </p>
          <p className='categoryListingName'>
            {listing.name}
          </p>
          <p className='categoryListingPrice'>
            {
              listing.offer 
              ? formatCurr(listing.discountedPrice) 
              : formatCurr(listing.regularPrice)
            }€ {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt='Beds' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
            </p>
            <img src={bathtubIcon} alt='Bathrooms' />
            <p className='categoryListingInfoText'>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <div className='removeIcon'>
          <DeleteIcon onClick={() => onDelete(listing.id, listing.name)} />
        </div>
      )}
      {onEdit && (
        <div className='editIcon'>
          <EditIcon onClick={() => onEdit(id)} />
        </div>
      )}
    </li>
  )
}