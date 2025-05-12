import { Link } from "react-router-dom"
import { Img } from 'react-image'

import Logo from '../assets/logo.png'
import Cart_icon from '../assets/cart.png'

function NavBar() {
  return (
    <div className="mx-80 flex justify-between items-center">
      <Link to={'/'}>
        <Img className="h-9" src={Logo} alt="Cart icon" />
      </Link>
      <div className="items-center">
        <ul className="flex gap-7 items-center">
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/'}>Home</Link>
          </li>
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/products'}>Products</Link>
          </li>
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/about'}>About</Link>
          </li>
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/contact'}>Contact</Link>
          </li>
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/account'}>Account</Link>
          </li>
          <li className="p-0 m-0">
            <Link className="text-base font-normal px-4 py-3" to={'/cart'}>
              <Img className="h-7" src={Cart_icon} alt="Cart icon" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar