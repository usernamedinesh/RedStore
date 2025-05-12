import { Link } from "react-router-dom"
import { Img } from "react-image"

import Logo from '../assets/logo-white.png'

import PlayStore from '../assets/play-store.png'
import AppStore from '../assets/app-store.png'

function Footer() {
  return (
    <div className="px-80 py-14 justify-center text-white bg-[#000]">
      <div className="mb-9 flex gap-7 justify-center">
        <div className="">
          <h3 className="mb-5 text-lg font-semibold">Download our App</h3>
          <p className="mb-5 text-sm text-gray-500">Download App for Android and ios mobile phone.</p>
          <div className="flex gap-2">
            <Link>
              <Img className="h-10" src={PlayStore} />
            </Link>
            <Link>
              <Img className="h-10" src={AppStore} />
            </Link>
          </div>
        </div>
        <div className="w-96 text-center justify-center">
          <Link>
            <Img className="mb-5 mx-auto h-14" src={Logo} />
          </Link>
          <p className="text-sm text-gray-500">Our Purpose Is To Sustainably Make the Pleasure and Benefits of Sports Accessible to the Many.</p>
        </div>
        <div className="">
          <h3 className="mb-5 text-lg font-semibold">Useful Links</h3>
          <ul className="text-sm text-gray-500">
            <li className="mb-1">
              <Link>Coupons</Link>
            </li>
            <li className="mb-1">
              <Link>Blog Post</Link>
            </li>
            <li className="mb-1">
              <Link>Return Policy</Link>
            </li>
            <li className="">
              <Link>Join Affiliate</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-lg font-semibold">Follow us</h3>
          <ul className="text-sm text-gray-500">
            <li className="mb-1">
              <Link>Facebook</Link>
            </li>

            <li className="mb-1">
              <Link>Twitter</Link>
            </li>

            <li className="mb-1">
              <Link>Instagram</Link>
            </li>

            <li className="">
              <Link>Youtube</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-5 h-0.5 bg-gray-400"></div>
      <p className="text-base text-gray-500 text-center">Copyright 2023 - <Link to={'https://kodevana.com'}>KodeVana</Link> | All Rights Reserved</p>
    </div>
  )
}

export default Footer