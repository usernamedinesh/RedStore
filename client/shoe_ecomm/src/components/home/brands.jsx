import { Img } from "react-image"
import { Link } from "react-router-dom"

import Brand_1 from '../../assets/logo-godrej.png'
import Brand_2 from '../../assets/logo-oppo.png'
import Brand_3 from '../../assets/logo-coca-cola.png'
import Brand_4 from '../../assets/logo-paypal.png'
import Brand_5 from '../../assets/logo-philips.png'

function Brands() {
  return (
    <div className="mx-96 my-16 flex gap-20 text-center items-center justify-center">
      <Link>
        <Img className="h-14 grayscale hover:grayscale-0 transition-all duration-200" src={Brand_1} />
      </Link>
      <Link>
        <Img className="h-16 grayscale hover:grayscale-0 transition-all duration-200" src={Brand_2} />
      </Link>
      <Link>
        <Img className="h-14 grayscale hover:grayscale-0 transition-all duration-200" src={Brand_3} />
      </Link>
      <Link>
        <Img className="h-16 grayscale hover:grayscale-0 transition-all duration-200" src={Brand_4} />
      </Link>
      <Link>
        <Img className="h-20 grayscale hover:grayscale-0 transition-all duration-200" src={Brand_5} />
      </Link>
    </div>
  )
}

export default Brands