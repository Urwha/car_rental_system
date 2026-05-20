import React from 'react';
import rangeRoverImage from '/assets/range rover.webp'; 

const HomeSection: React.FC = () => {
  return (
    <section className="py-5 flex-grow-1 d-flex align-items-center">
      <div className="container ">
        <div className="row align-items-center">
          {/* Text Column */}
          <div className="col-md-6">
            <h2>Reliable Cars at Your Service</h2>
            <p>Choose from a wide range of vehicles for your needs.</p>
            <p>Whether you're planning a weekend getaway, need a ride for business, or just want to cruise in style, CarRental offers a wide selection of vehicles at unbeatable prices. Enjoy a seamless booking experience and top-notch customer service every step of the way.</p>
            <a href="/cars" className="btn btn-outline-dark">Browse Cars</a>
          </div>

          {/* Image Column */}
          <div className="col-md-6">
            <img style={{ height: '300px', width: '500px', objectFit: 'cover' }} src={rangeRoverImage} className="img-fluid section-side-img" alt="Car Banner" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;