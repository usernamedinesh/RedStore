import { Img } from "react-image"
import { Link } from "react-router-dom"

import ProductsData from '../../assets/product'

function LatestProducts() {
  return (
    <div className="my-20 mx-96 ">
      <div className='text-center justify-center'>
        <h2 className='text-2xl pb-5 text-[#563434] font-extrabold border-b-4 border-[#ff523b]'>Latest Products</h2>
      </div>
      <div className="my-24 grid grid-rows-2 gap-16">
        <div className="flex gap-5 justify-center">
          {ProductsData.slice(0, 4).map((product) => (
            <Link key={product.id} className="transition-all duration-700 hover:-translate-y-2" to={`/product/${product.id}`}>
              <Img className="mb-1 h-80" src={product.image} alt={product.name} />
              <h3 className="mb-1 text-gray-600">{product.name}</h3>
              <div className="mb-1 flex gap-2 w-fit text-[#ff523b]">
                <i className="fa fa-star" ></i>
                <i className="fa fa-star" ></i>
                <i className="fa fa-star" ></i>
                <i className="fa fa-star-half-o" ></i>
                <i className="fa fa-star-o" ></i>
              </div>
              <p className="text-gray-600">{product.price}</p>
            </Link>
          ))}
        </div>
        <div className="flex gap-5 justify-center">
          {ProductsData.slice(8, 12).map((product) => (
            <Link key={product.id} className="transition-all duration-700 hover:-translate-y-2" to={`/product/${product.id}`}>
              <Img className="mb-1 h-80" src={product.image} alt={product.name} />
              <h3 className="mb-1 text-gray-600">{product.name}</h3>
              <div className="mb-1 flex gap-2 w-fit text-[#ff523b]">
                <i className="fa fa-star" ></i>
                <i className="fa fa-star" ></i>
                <i className="fa fa-star" ></i>
                <i className="fa fa-star-half-o" ></i>
                <i className="fa fa-star-o" ></i>
              </div>
              <p className="text-gray-600">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LatestProducts