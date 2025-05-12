import { Img } from "react-image"

import User_1 from '../../assets/user-1.png'
import User_2 from '../../assets/user-2.png'
import User_3 from '../../assets/user-3.png'

function Testimonials() {
  return (
    <div className="mx-96 my-16 items-center text-center">
      <div className="grid grid-cols-3 gap-9">
        <div className="p-10 text-center justify-center items-center shadow-md transition-all duration-700 hover:-translate-y-2">
          <i className="mb-4 fa fa-quote-left text-4xl text-[#ff523b]" ></i>
          <p className="mb-4 text-xs text-gray-600 leading-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&lsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          <div className="mb-5 mx-auto flex gap-2 w-fit text-[#ff523b]">
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star-o" ></i>
          </div>
          <Img className="mb-3 mx-auto h-12 rounded-full" src={User_1} />
          <p className="text-lg text-[#563434] font-semibold">Sean Parkar</p>
        </div>
        <div className="p-10 text-center justify-center items-center shadow-md transition-all duration-700 hover:-translate-y-2">
          <i className="mb-4 fa fa-quote-left text-4xl text-[#ff523b]" ></i>
          <p className="mb-4 text-xs text-gray-600 leading-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&lsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          <div className="mb-5 mx-auto flex gap-2 w-fit text-[#ff523b]">
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star-half-o" ></i>
          </div>
          <Img className="mb-3 mx-auto h-12 rounded-full" src={User_2} />
          <p className="text-lg text-[#563434] font-semibold">Sean Parkar</p>
        </div>
        <div className="p-10 text-center justify-center items-center shadow-md transition-all duration-700 hover:-translate-y-2">
          <i className="mb-4 fa fa-quote-left text-4xl text-[#ff523b]" ></i>
          <p className="mb-4 text-xs text-gray-600 leading-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&lsquo;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          <div className="mb-5 mx-auto flex gap-2 w-fit text-[#ff523b]">
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star" ></i>
            <i className="fa fa-star-half-o" ></i>
            <i className="fa fa-star-o" ></i>
          </div>
          <Img className="mb-3 mx-auto h-12 rounded-full" src={User_3} />
          <p className="text-lg text-[#563434] font-semibold">Sean Parkar</p>
        </div>
      </div>
    </div>
  )
}

export default Testimonials