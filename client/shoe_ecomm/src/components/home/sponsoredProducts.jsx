import { Img } from 'react-image'
import { Link } from 'react-router-dom'

import Product_1 from '../../assets/category-1.jpg'
import Product_2 from '../../assets/category-2.jpg'
import Product_3 from '../../assets/category-3.jpg'

function SponsoredProducts() {
  return (
    <div className='mx-96 my-20 flex gap-9 text-center justify-center'>
      <Link>
        <Img className='h-80' src={Product_1} />
      </Link>
      <Link>
        <Img className='h-80' src={Product_2} />
      </Link>
      <Link>
        <Img className='h-80' src={Product_3} />
      </Link>
    </div>
  )
}

export default SponsoredProducts