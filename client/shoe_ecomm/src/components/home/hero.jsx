import { Link } from "react-router-dom"
import { Img } from "react-image"
import Hero_banner from '../../assets/hero-banner.png'

function Hero() {
  return (
    <div className="mx-80 pt-40 pb-16 grid grid-cols-2 items-center">
      <div>
        <h1 className="mb-8 text-5xl font-extrabold leading-snug">Give your Workout <br />A New Style!</h1>
        <p className="mb-8 text-base text-gray-600">Success isn&lsquo;t always about greatness. It&lsquo;s about consistency. Consistent hard work gains success. Greatness will come.</p>
        <Link className="px-6 py-2.5 text-white bg-[#ff523b] hover:bg-[#563434] transition-all duration-500 rounded-3xl" to={'/products'}>Explore Now —&gt;</Link>
      </div>
      <div>
        <Img src={Hero_banner}/>
      </div>
    </div>
  )
}

export default Hero