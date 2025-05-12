import { Img } from 'react-image'

import { Link } from 'react-router-dom'

import ProductsData from '../../assets/product'

function CartProducts() {
  return (
    <div className="mx-96 my-16">
      <div className="px-3 py-2 flex justify-between text-white bg-[#ff523b]">
        <p className='w-80'>Products</p>
        <p>Quantity</p>
        <p>Subtotal</p>
      </div>
      <div className="p-3">
        {ProductsData.slice(9, 12).map((product) => (
          <div key={product.id} className="mb-7 flex justify-between">
            <span className='w-80 flex gap-3'>
              <Img className="h-24" src={product.image} alt={product.name} />
              <span>
                <h3 className="text-gray-600">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
                <Link className='text-sm text-[#ff523b]'>Remove</Link>
              </span>
            </span>
            <input className="p-1 h-10 w-10 border" value={1} type="number" />
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CartProducts