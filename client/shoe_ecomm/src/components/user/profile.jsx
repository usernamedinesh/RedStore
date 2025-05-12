import { Img } from "react-image"
import { Link } from "react-router-dom"

import ProductsData from '../../assets/product'

import UserDp from '../../assets/user-2.png'

function Profile() {
  return (
    <div className="mx-96 my-16">
      <div className="mb-10 grid grid-cols-2 gap-16">
        <div className="mb-7 flex gap-7 items-center">
          <Img className="h-20 rounded-full" src={UserDp} />
          <span>
            <p className="text-lg font-medium">John William</p>
            <p className="text-sm text-gray-600">Age: 23</p>
          </span>
        </div>
        <div className="">
          <span className=" mb-5 flex gap-3 px-3 py-2 shadow-inner bg-gray-50 border rounded-md">
            <p className="text-sm text-gray-600">Email:</p>
            <p className="text-sm text-gray-600">johnwilliam@gmail.com</p>
          </span>
          <span className="flex gap-3 px-3 py-2 shadow-inner bg-gray-50 border rounded-md">
            <p className="text-sm text-gray-600">Since:</p>
            <p className="text-sm text-gray-600">5 years</p>
          </span>
        </div>
      </div>
      <div>
        <h3 className="mb-7 text-3xl font-medium">Your Orders</h3>
        <div className="flex gap-7 justify-center">
          {ProductsData.slice(9, 13).map((product) => (
            <Link key={product.id} className="transition-all duration-700 hover:-translate-y-2" to={`/products/${product.id}`}>
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

export default Profile