import logo from "../assets/logo-white.png";
import app_store from "../assets/app-store.png";
import play_store from "../assets/play-store.png";
import { NavLink } from "react-router";

function Footer() {
  return (
    <>
      <div className="px-4 md:px-20 lg:px-36 mt-5">
        <div className="flex flex-col md:flex-row flex-wrap gap-5 justify-around">
          {/* Left Block */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-lg mb-3 font-semibold">Download our App</h3>
            <p className="mb-3 text-sm">
              Download app for Android and iOS mobile phone
            </p>
            <div className="mb-3 flex  flex-wrap gap-3.5">
              <img src={play_store} className="h-10" />
              <img src={app_store} className="h-10" />
            </div>
          </div>

          {/* Center Block */}
          <div className="flex-1 min-w-[250px] text-center">
            <img src={logo} alt="logo" className="mb-5 mx-auto h-10" />
            <p className="text-sm">
              Our Purpose Is To Sustainably Make the Pleasure and Benefits of
              Sports Accessible to the Many.
            </p>
          </div>

          {/* Right Block */}
          {/* <div className="flex flex-col sm:flex-row flex-wrap gap-6"> */}
          <div className="flex flex-row flex-wrap gap-6">
            <div>
              {/* End block */}
              <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
              <ul className="text-sm text-gray-500">
                <li className="mb-1">
                  <NavLink>Facebook</NavLink>
                </li>
                <li className="mb-1">
                  <NavLink>Twitter</NavLink>
                </li>
                <li className="mb-1">
                  <NavLink>Instagram</NavLink>
                </li>
                <li>
                  <NavLink>Youtube</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-semibold">Follow us</h3>
              <ul className="text-sm text-gray-500">
                <li className="mb-1">
                  <NavLink className="hover:text-yellow-900 transition">
                    Facebook
                  </NavLink>
                </li>
                <li className="mb-1">
                  <NavLink className="hover:text-yellow-900 transition">
                    Twitter
                  </NavLink>
                </li>
                <li className="mb-1">
                  <NavLink className=" hover:text-yellow-900 transition">
                    Instagram
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3.5 dark:bg-green-400 h-0.5 mb-3.5 bg-black" />

        <div className="py-2">
          <p className="text-base text-gray-500 text-center">
            Copyright 2025 -{" "}
            <NavLink to="https://kodevana.com" end>
              KodeVana
            </NavLink>{" "}
            | All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
}

export default Footer;
