import { Img } from 'react-image'
import { Link } from 'react-router-dom'

import Hero_banner from '../../assets/hero-banner.png'

import '../../styles/home.css'

function ProductAdvertisement() {
  return (
    <div className="my-16 gradient">
      <div className="py-20 mx-96">
        <div className="mx-24 grid grid-cols-2 items-center">
          <div className="">
            <Img src={Hero_banner} className="h-96" />
          </div>
          <div className="">
            <p className='mb-10'>Exclusively Available on RedStore</p>
            <h1 className='mb-10 text-5xl font-extrabold'>Sports Shoes</h1>
            <p className='mb-10'> Buy latest collections of sports shoes online on Redstore at best prices from top brands such as Adidas, Nike, Puma, Asics, and Sparx at your leisure at best prices. </p>
            <Link
              className="px-6 py-2.5 text-white bg-[#ff523b] hover:bg-[#563434] transition-all duration-500 rounded-3xl"
              to={'/products'}>
              Buy Now —&gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductAdvertisement
