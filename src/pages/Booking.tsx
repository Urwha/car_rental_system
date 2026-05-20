import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Car {
  id: string;
  name: string;
  category: string;
}

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [carId, setCarId] = useState('');
  const [formData, setFormData] = useState({
    car_name: '',
    car_category: '',
    name: '',
    phone: '',
    email: '',
    pickup: '',
    return: '',
    days: '',
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setCarId(id);
      fetch(`http://localhost:5000/cars/${id}`)
        .then((res) => res.json())
        .then((data) => setCar({ id: data.id, name: data.name, category: data.category }))
        .catch((err) => console.error('Car fetch error:', err));
    }
  }, [location.search]);

  useEffect(() => {
  if (car) {
    setFormData((prev) => ({
      ...prev,
      car_name: car.name,
      car_category: car.category,
    }));
  }
}, [car]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = () => {
    const newApplication = {
      ...formData,
      carId,
    };

    fetch('http://localhost:5000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplication),
    })
      .then(() => {
        setShowModal(false);
        alert('Booking confirmed!');
        navigate('/cars');
      })
      .catch((err) => console.error('Submit error:', err));
  };

  return (
    <>
      {/* Banner */}
      <div className="text-center py-5" style={{ backgroundColor: '#6b757c' }}>
        <h1 className="text-white fw-bold display-5">Car Booking Form</h1>
      </div>

      {/* Form Section */}
      <section className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '100vh', backgroundColor: '#f1e9e1' }}>
        <form
          onSubmit={handleSubmit}
          className="p-4 shadow text-white"
          style={{ width: '60%', maxWidth: '850px', backgroundColor: '#6c757d', borderRadius: '10px' }}
        >
          <div className="row g-4">
            <div className="col-md-6">
              <input
                type="text"
                id="car_name"
                onChange={handleChange}
                value={formData.car_name}
                className="form-control custom-input"
                placeholder="Car Name"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                id="car_category"
                onChange={handleChange}
                value={formData.car_category}
                className="form-control custom-input"
                placeholder="Category"
              />
            </div>
            <div className="col-md-6">
              <input id="name" type="text" placeholder="Your Name" className="form-control custom-input" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input id="phone" type="tel" placeholder="Phone Number" className="form-control custom-input" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input id="email" type="email" placeholder="Email Address" className="form-control custom-input" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input id="days" type="number" min="1" placeholder="Number of Days" className="form-control custom-input" value={formData.days} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label text-white">Pickup Date</label>
              <input id="pickup" type="date" className="form-control custom-input" value={formData.pickup} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label text-white">Return Date</label>
              <input id="return" type="date" className="form-control custom-input" value={formData.return} onChange={handleChange} required />
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-light px-5 rounded-pill fw-bold">Confirm Booking</button>
            </div>
          </div>
        </form>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: '#6c757d', color: 'white' }}>
              <div className="modal-header">
                <h5 className="modal-title">Confirm Booking</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Car:</strong> {car?.name} ({car?.category})</p>
                <p><strong>Days:</strong> {formData.days}</p>
                <p><strong>Pickup:</strong> {formData.pickup}</p>
                <p><strong>Return:</strong> {formData.return}</p>
              </div>
              <div className="modal-footer">
                <button onClick={confirmSubmit} className="btn btn-dark rounded-pill">Confirm & Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Styles */}
      <style>{`
        .custom-input {
          background: transparent;
          border: none;
          border-bottom: 2px solid white;
          border-radius: 0;
          color: white;
          height: 50px;
        }
        .custom-input::placeholder {
          color: white;
          opacity: 0.8;
        }
        .custom-input:focus {
          background: transparent;
          color: white;
          box-shadow: none;
          border-color: white;
        }
      `}</style>
    </>
  );
};

export default Booking;
