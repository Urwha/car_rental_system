import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  model: string;
  description: string;
  confirmed?: boolean;
}

interface Application {
  carId: string;
}

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/cars`)
      .then(res => res.json())
      .then(data => setCars(data))
      .catch(err => console.error('Error fetching cars:', err));

    fetch(`${BASE_URL}/applications`)
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Error fetching applications:', err));
  }, []);

  const isApplied = (carId: string) => applications.some(app => app.carId === carId);

  const filteredCars = cars.filter(car => {
    const categoryMatch = categoryFilter ? car.category === categoryFilter : true;
    const priceMatch =
      priceFilter === 'lt30000' ? car.price < 30000 :
      priceFilter === '31000to90000' ? car.price >= 31000 && car.price <= 90000:
      priceFilter === 'gt90000' ? car.price > 90000 : true;
    return categoryMatch && priceMatch;
  });

  return (
    <>
      {/* Header Section */}
      <section className="text-white text-center py-5" style={{ background: '#6b757c' }}>
        <h1 className="text-white fw-bold display-5">All Cars</h1>
      </section>

      {/* Filters */}
      <div className="container my-4">
        <div className="row g-3">
          <div className="col-md-6">
            <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Filter by Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Sports">Sports</option>
              <option value="Economy">Economy</option>
            </select>
          </div>
          <div className="col-md-6">
            <select className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="">Filter by Price</option>
              <option value="lt30,000">Less than Rs.30,000</option>
              <option value="31000to90000">Rs.31,000 - Rs.90,000</option>
              <option value="gt90000">More than Rs.90,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Car Cards */}
      <section className="container my-5">
        <div className="row">
          {filteredCars.map((car) => {
            const rented = car.confirmed;
            const applied = isApplied(car.id);

            return (
              <div key={car.id} className="col-md-4 mb-4">
                <div className="card bg-secondary text-white h-100 shadow position-relative">
                  <div className="position-relative">
                    <img
                      src={car.image}
                      className="card-img-top"
                      alt={car.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    {rented && (
                      <span className="position-absolute bottom-0 start-0 m-2 px-3 py-1 bg-dark text-white rounded-pill shadow-sm" style={{ fontSize: '0.9rem' }}>
                        Rented
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{car.name}</h5>
                    <p className="card-text">Price: Rs.{car.price} / day</p>
                    <p className="card-text">Category: {car.category}</p>
                    <p className="card-text">Model: {car.model}</p>
                    <div className="d-flex d-flex gap-2">
                      <button
                        className="btn btn-light rounded-pill"
                        onClick={() => setSelectedCar(car)}
                      >
                        Info
                      </button>
                      {rented ? (
                        <button className="btn btn-light btn-sm rounded-pill" disabled>Rented</button>
                      ) : applied ? (
                        <button className="btn btn-light btn-sm rounded-pill" disabled>Already Applied</button>
                      ) : (
                        <Link to={`/booking?id=${car.id}`} className="btn btn-dark text-white rounded-pill">Book Now</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info Modal */}
      {selectedCar && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content bg-dark text-white rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCar.name} Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCar(null)}></button>
              </div>
              <div className="modal-body d-flex">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  style={{ width: '50%', objectFit: 'cover', height: '300px' }}
                  className="me-3"
                />
                <div>
                  <p><strong>Category:</strong> {selectedCar.category}</p>
                  <p><strong>Model:</strong> {selectedCar.model}</p>
                  <p><strong>Price:</strong> Rs.{selectedCar.price} / day</p>
                  <p><strong>Description:</strong> {selectedCar.description}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-light" onClick={() => setSelectedCar(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cars;
