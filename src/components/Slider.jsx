import React from 'react'
import {useNavigate} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation, Pagination, Scrollbar, A11y, Autoplay} from 'swiper'
import {Spinner} from './'
import {db} from '../firebase.config'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

export const Slider = () => {
  const [listings, setListings] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    (async() => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnapshot = await getDocs(q)

      let listings = []
      querySnapshot.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      
      setListings(listings)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }

  return listings && (
    <>
      <p className="exploreHeading">Recommended</p>
      <Swiper
        style={{height: 400}}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        slidesPerView={1} 
        pagination={{clickable: true}}
        autoplay={true}
      >
        {listings.map(({data, id}) => {
          return (
            <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div 
                className='swiperSlideDiv' 
                style={{background: `url(${data.imageURLS[0]}) center / cover no-repeat`}}
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  {data.discountedPrice ?? data.regularPrice}€
                  {data.type === 'rent' && ' / month'}
                </p>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}