import React from 'react'
import {
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter
} from 'firebase/firestore'
import {Spinner, ListingItem} from '../components'
import {toast} from 'react-toastify'
import {db} from '../firebase.config'

export const Offers = () => {
  const [listings, setListings] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [lastFetchedListing, setLastFetchedListing] = React.useState(null)

  React.useEffect(() => {
    (async() => {
      try {
        // Get a collection reference
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(
          listingsRef, 
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        // Execute query to get a snapshot
        const querySnapshot = await getDocs(q)
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        setLastFetchedListing(lastVisible)

        const listings = []
        querySnapshot.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    })()
  }, [])
  
  // Pagination / Load more listings
  const handlePagination = async() => {
    try {
      // Get a collection reference
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(
        listingsRef, 
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      // Execute query to get a snapshot
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const listings = []
      querySnapshot.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(prevListings => [...prevListings, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      { 
        loading 
        ? <Spinner /> 
        : (
          listings && listings.length > 0 
          ? (
            <React.Fragment>
              <main>
                <ul className="categoryListings">
                  {listings.map(listing => {
                    return (
                      <ListingItem 
                        key={listing.id} 
                        id={listing.id} 
                        listing={listing.data}
                      />
                    )
                  })}
                </ul>
              </main>
              <br/>
              <br/>
              {lastFetchedListing && (
                <p className='loadMore' onClick={handlePagination}>
                  Load More
                </p>
              )}
            </React.Fragment>
          ) 
          : <p>There are no offers at the moment</p>
        )
      }
    </div>
  )
}