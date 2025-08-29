import React from "react";
import { cardData } from "../../assets/data"; // Sesuaikan jalur impor sesuai dengan struktur proyek Anda
import coffeeVideo from "../../assets/img/coffee.mp4";
const VideoBackground = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
      >
        <source src={coffeeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white bg-black bg-opacity-50 pt-20">
        <h1 className="text-4xl font-bold mb-4 text-center animate__animated animate__fadeInUp">
          Welcome to UtopiaCafe
        </h1>
        <p className="text-lg text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">
          "Life's too short for bad coffee." - Gord Downie
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 py-4 animate__animated animate__fadeInUp animate__delay-2s">
          {cardData.map(
            ({ id, imgSrc, title, description, link, linkText }) => (
              <div
                key={id}
                className="w-full max-w-sm rounded overflow-hidden shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg transform transition-transform hover:scale-105 hover:shadow-xl duration-300 aspect-w-4 aspect-h-3"
              >
                <div className="relative group">
                  <img
                    src={imgSrc}
                    alt={`${title} Image`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-between text-white text-center p-4">
                    <div className="relative z-10">
                      <h5 className="text-xl font-bold mb-2">{title}</h5>
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-200 mb-2">{description}</p>
                      <div className="p-1">
                        <a
                          href={link}
                          className="block bg-primary-color text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-secondary-color hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition-all duration-300"
                        >
                          {linkText}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
