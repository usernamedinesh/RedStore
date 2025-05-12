import NavBar from '../components/navBar.jsx'
import Footer from '../components/footer.jsx'
import Hero from '../components/home/hero.jsx'
import SponsoredProduct from '../components/home/sponsoredProducts.jsx'
import FeaturedProducts from '../components/home/featuredProducts.jsx'
import LatestProducts from '../components/home/latestProducts.jsx'
import ProductAdvertisement from '../components/home/productAdvertisement.jsx'
import Testimonials from '../components/home/testimonials.jsx'
import Brands from '../components/home/brands.jsx'

import '../styles/home.css'

export default function Home() {
  return (
    <div>
      <div className='gradient'>
        <NavBar />
        <Hero />
      </div>
      <SponsoredProduct />
      <FeaturedProducts />
      <LatestProducts />
      <ProductAdvertisement />
      <Testimonials />
      <Brands />
      <Footer />
    </div>
  )
}
