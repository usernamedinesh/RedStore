
import { Img } from 'react-image'
import { Link } from 'react-router-dom'

import ProductsData from '../../assets/product'

function ProductCards() {
  return (
    <div className="mx-96 my-20">
      <div className='mb-10 flex items-center justify-between'>
        <span>
          <h2 className='text-2xl font-bold'>All Products</h2>
        </span>
        <select className='px-3 py-2 text-sm'>
          <option value="default">Default sorting</option>
          <option value="relavence">By relavence</option>
          <option value="popularity">By popularity</option>
          <option value="lhprice">Price: low -&gt; hight</option>
          <option value="hlprice">Price: high -&gt; low</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {ProductsData.map((product) => (
          <Link key={product.id} className="mb-12 transition-all duration-700 hover:-translate-y-2" to={`/product/${product.id}`}>
            <Img className="mb-2 h-80" src={product.image} alt={product.name} />
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
      <div className='w-fit text-sm flex gap-5 font-medium'>
        <span className='px-4 py-2 border hover:text-white border-[#ff523b] hover:bg-[#ff523b]'>1</span>
        <span className='px-4 py-2 border hover:text-white border-[#ff523b] hover:bg-[#ff523b]'>2</span>
        <span className='px-4 py-2 border hover:text-white border-[#ff523b] hover:bg-[#ff523b]'>3</span>
        <span className='px-4 py-2 border hover:text-white border-[#ff523b] hover:bg-[#ff523b]'>4</span>
        <span className='px-2.5 py-2 border hover:text-white border-[#ff523b] hover:bg-[#ff523b]'>—&gt;</span>
      </div>
    </div >
  )
}

export default ProductCards
