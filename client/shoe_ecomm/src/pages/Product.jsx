import { Img } from 'react-image';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import NavBar from '../components/navBar';
import Footer from '../components/footer';

import ProductsData from '../assets/product'

export default function Product() {
  const { id } = useParams();
  const product = ProductsData.find((product) => product.id === parseInt(id));

  if (!product) {
    return <div>Tour not found</div>;
  }

  return (
    <div>
      <NavBar />
      <div className='my-16 mx-96'>
        <div className='grid grid-cols-2 gap-7 justify-center'>
          <span>
            <p className='mb-5 text-lg font-medium'>{product.name}</p>
            <div className='mb-5 flex gap-7'>
              <span className='p-2 h-10 w-10 items-center text-center bg-gray-100 rounded-full'>S</span>
              <span className='p-2 h-10 w-10 items-center text-center bg-gray-100 rounded-full'>M</span>
              <span className='p-2 h-10 w-10 items-center text-center bg-gray-100 rounded-full'>L</span>
              <span className='p-2 h-10 w-10 items-center text-center bg-gray-100 rounded-full'>XL</span>
              <span className='p-2 h-10 w-10 items-center text-center bg-gray-100 rounded-full'>XXL</span>
            </div>
            <p className='mb-5 text-base'>{product.price}</p>
            <div className="mb-1 flex gap-2 w-fit text-[#ff523b]">
              <i className="fa fa-star" ></i>
              <i className="fa fa-star" ></i>
              <i className="fa fa-star" ></i>
              <i className="fa fa-star-half-o" ></i>
              <i className="fa fa-star-o" ></i>
            </div>
          </span>
          <Img className='mb-10 h-96' src={product.image} />
        </div>
        <div className='flex gap-7 justify-center'>
          <Link className='px-3 py-2 text-[#ff523b] hover:text-white font-medium bg-white hover:bg-[#ff523b] border-2 border-[#ff523b] transition-all duration-300 rounded-md' to={'/cart'}>Buy Now</Link>
          <Link className='px-3 py-2 text-[#ff523b] hover:text-white font-medium bg-white hover:bg-[#ff523b] border-2 border-[#ff523b] transition-all duration-300 rounded-md' to={'/cart'}>Add to Cart</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
