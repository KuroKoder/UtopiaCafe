import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { navLinks } from "../assets/data";
import logo from "../assets/img/utopia.png";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol toggle bar

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle nilai state isOpen
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);

    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, []);

  return (
    <div className="fixed w-full z-50">
      <nav
        className={`transition-all duration-200 ease-in-out ${
          changeColor || isOpen ? "bg-gray-800 py-2" : "bg-transparent py-4"
        }  fixed w-full z-50 top-0 left-0`}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
          <div className="flex items-center">
            <img
              alt="logo"
              src={logo}
              width="55"
              height="55"
              className="mr-2"
            />
            <span className="text-2xl font-bold font-pacifico text-gray-200">
              UtopiaCafe.
            </span>
          </div>
          <button
            onClick={toggleMenu} // Panggil fungsi toggleMenu saat tombol hamburger diklik
            className="lg:hidden block text-gray-200 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } w-full lg:flex lg:items-center lg:w-auto`}
          >
            <div className="text-center mx-auto">
              {navLinks.map((link) => {
                return (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    className={({ isActive }) =>
                      `block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mx-4 ${
                        isActive
                          ? "bg-green-500 text-white rounded py-1 px-2 transition-transform transform scale-105"
                          : ""
                      }`
                    }
                    end
                  >
                    {link.text}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarComponent;
