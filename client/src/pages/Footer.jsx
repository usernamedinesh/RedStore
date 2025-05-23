import logo from "../assets/logo-white.png";
import app_store from "../assets/app-store.png";
import play_store from "../assets/play-store.png";
import { NavLink } from "react-router"; // Corrected import from previous conversation

function Footer() {
  return (
    <>
      <div className="px-4 md:px-20 lg:px-36 mt-5">
        <div className="flex flex-col md:flex-row justify-between gap-5">
          {" "}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-lg mb-3 font-semibold">Download our App</h3>
            <p className="mb-3 text-sm">
              Download app for Android and iOS mobile phone
            </p>
            <div className="mb-3 flex flex-wrap gap-3.5">
              {" "}
              <img src={play_store} className="h-10" alt="Play Store" />
              <img src={app_store} className="h-10" alt="App Store" />
            </div>
          </div>
          {/* Center Block */}
          {/* Apply flex-1 and keep text-center */}
          <div className="flex-1 min-w-[250px] text-center">
            <img src={logo} alt="logo" className="mb-5 mx-auto h-10" />
            <p className="text-sm">
              Our Purpose Is To Sustainably Make the Pleasure and Benefits of
              Sports Accessible to the Many.
            </p>
          </div>
          <div className="flex-1 min-w-[250px] flex flex-row flex-wrap gap-6 justify-around md:justify-between">
            {" "}
            <div>
              <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
              <ul className="text-sm text-gray-500">
                <li className="mb-1">
                  <NavLink to="/facebook">Facebook</NavLink>{" "}
                  {/* Added dummy `to` prop */}
                </li>
                <li className="mb-1">
                  <NavLink to="/twitter">Twitter</NavLink>
                </li>
                <li className="mb-1">
                  <NavLink to="/instagram">Instagram</NavLink>
                </li>
                <li>
                  <NavLink to="/youtube">Youtube</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-semibold">Follow us</h3>
              <ul className="text-sm text-gray-500">
                <li className="mb-1">
                  <NavLink
                    className="hover:text-yellow-900 transition"
                    to="/facebook"
                  >
                    Facebook
                  </NavLink>
                </li>
                <li className="mb-1">
                  <NavLink
                    className="hover:text-yellow-900 transition"
                    to="/twitter"
                  >
                    Twitter
                  </NavLink>
                </li>
                <li className="mb-1">
                  <NavLink
                    className=" hover:text-yellow-900 transition"
                    to="/instagram"
                  >
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
