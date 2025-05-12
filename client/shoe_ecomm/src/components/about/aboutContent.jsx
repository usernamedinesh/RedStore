import { Img } from 'react-image'

import Hero_banner from '../../assets/hero-banner.png'

function AboutContent() {
  return (
    <div className="mx-96 py-20">
      <div className="grid grid-cols-2 gap-9">
        <div>
          <h2 className='mb-3 text-3xl font-semibold'><span className='text-[#ff523b]'>Red</span>Store Your Ultimate Fashion Destination</h2>
          <p className='mb-7 text-gray-600'>Welcome to RedStore, where style meets convenience! RedStore is your go-to e-commerce destination for an extensive range of clothing, shoes, and watches. Our carefully curated collection brings together the latest trends, timeless classics, and everything in between, ensuring that you find the perfect style for every occasion.</p>
          <h3 className='mb-3 text-xl font-semibold'>Fashion for Every Taste</h3>
          <p className='mb-7 text-gray-600'>Discover a diverse selection of clothing that caters to every taste and preference. From casual wear that keeps you comfortable throughout the day to elegant evening dresses that make a statement, RedStore has it all. Our wide range of sizes and styles ensures that everyone finds their ideal fit.</p>
        </div>
        <div>
          <Img className='' src={Hero_banner} alt='Hero Banner' />
        </div>
      </div>
      <div className='mb-9 grid grid-cols-4 gap-5'>
        <div className='p-5 shadow-md shadow-pink-200'>
          <h3 className='mb-3 text-xl font-semibold'>Step into Style with Footwear</h3>
          <p className='mb-7 text-sm text-gray-600'>Step into a world of footwear fashion at RedStore. Whether you&lsquo;re looking for trendy sneakers, formal shoes for the office, or comfortable sandals for a casual day out, our footwear collection covers all bases. Explore quality craftsmanship and designs that keep you on-trend.</p>
        </div>
        <div className='p-5 shadow-md shadow-pink-200'>
          <h3 className='mb-3 text-xl font-semibold'>Timeless Elegance with Watches</h3>
          <p className='mb-7 text-sm text-gray-600'>Enhance your style with our exquisite collection of watches. From classic timepieces that exude sophistication to modern, bold designs that make a statement, RedStore&lsquo;s watch collection complements your lifestyle. Stay punctual and stylish with our curated selection of watches from renowned brands.</p>
        </div>
        <div className='p-5 shadow-md shadow-pink-200'>
          <h3 className='mb-3 text-xl font-semibold'>Quality Assured</h3>
          <p className='mb-7 text-sm text-gray-600'>At RedStore, we prioritize quality and craftsmanship. Each product is carefully selected to ensure durability, comfort, and style. Our commitment to offering you the best ensures a seamless shopping experience.</p>
        </div>
        <div className='p-5 shadow-md shadow-pink-200'>
          <h3 className='mb-3 text-xl font-semibold'>Convenient Shopping Experience</h3>
          <p className='mb-7 text-sm text-gray-600'>Experience hassle-free and secure shopping with RedStore. Our user-friendly website and intuitive interface make browsing, selecting, and purchasing your favorite items a breeze. Enjoy the convenience of doorstep delivery and a straightforward return policy.</p>
        </div>
      </div>
      <p className='text-sm text-center text-gray-500'>RedStore is not just an e-commerce site; it&lsquo;s your fashion partner, bringing you the latest trends and timeless classics to elevate your style. Embrace the world of fashion with RedStore - where every purchase is a step towards your unique expression of style.</p>
    </div>
  )
}

export default AboutContent