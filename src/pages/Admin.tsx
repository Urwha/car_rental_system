import React, { useEffect, useState } from 'react';

interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  model: string;
  description: string;
  applied: boolean;
  confirmed: boolean;
  renterName?: string;
  renterPhone?: string;
  pickup?: string;
  return?: string;
  days?: string;
}

interface Application {
  id: string;
  name: string;
  phone: string;
  email: string;
  pickup: string;
  return: string;
  days: string;
  carId: string;
}

const Admin: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedApp, setSelectedApp] = useState<{ app: Application; car: Car } | null>(null);
  const [selectedRented, setSelectedRented] = useState<Car | null>(null);
  const [newCarConfirm, setNewCarConfirm] = useState<Car | null>(null);

  const [formData, setFormData] = useState({
    name: '', image: '', price: '', description: '', category: '', model: ''
  });

  const fetchData = () => {
    fetch('http://localhost:5000/applications').then(res => res.json()).then(setApplications);
    fetch('http://localhost:5000/cars').then(res => res.json()).then(setCars);
  };

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn]);

  const handleLogin = () => {
    if (password === 'urwha123') setLoggedIn(true);
    else alert('Wrong password');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPassword('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getCarById = (id: string) => cars.find(c => c.id === id);

  const addCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = cars.length > 0 ? (Math.max(...cars.map(c => parseInt(c.id))) + 1).toString() : '1';
    const newCar: Car = {
      id: nextId,
      name: formData.name,
      image: formData.image,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      model: formData.model,
      applied: false,
      confirmed: false,
    };
    await fetch('http://localhost:5000/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar),
    });
    setNewCarConfirm(newCar);
    setFormData({ name: '', image: '', price: '', description: '', category: '', model: '' });
    fetchData();
  };

  const updateCarStatus = async (carId: string, updates: Partial<Car>) => {
    await fetch(`http://localhost:5000/cars/${carId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchData();
  };

  const cancelApp = async (appId: string, carId: string) => {
    await fetch(`http://localhost:5000/applications/${appId}`, { method: 'DELETE' });
    await updateCarStatus(carId, {
      applied: false,
      confirmed: false,
      renterName: '',
      renterPhone: '',
      pickup: '',
      return: '',
      days: '',
    });
  };

  const acceptApp = async (app: Application, carId: string) => {
    await updateCarStatus(carId, {
      applied: true,
      confirmed: true,
      renterName: app.name,
      renterPhone: app.phone,
      pickup: app.pickup,
      return: app.return,
      days: app.days,
    });
    await fetch(`http://localhost:5000/applications/${app.id}`, { method: 'DELETE' });
  };

  const unrentCar = async (carId: string) => {
    await updateCarStatus(carId, {
      applied: false,
      confirmed: false,
      renterName: '',
      renterPhone: '',
      pickup: '',
      return: '',
      days: '',
    });
  };

  if (!loggedIn) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-secondary-subtle text-dark">
        <h2>Admin Login</h2>
        <input type="password" className="form-control w-25 mt-3 mb-2" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-light" onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <h1 className="text-center text-dark mb-4">All Applications</h1>
      <div className="container">
        <div className="row">
          {applications.map(app => {
            const car = getCarById(app.carId);
            if (!car) return null;
            return (
              <div key={app.id} className="col-md-6 mb-4">
                <div className="card bg-secondary text-white shadow p-3">
                  <h4>{app.name}</h4>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  <p><strong>Car:</strong> {car.name} ({car.category})</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light rounded-pill" onClick={() => setSelectedApp({ app, car })}>Info</button>
                    <button className="btn btn-success rounded-pill" onClick={() => acceptApp(app, app.carId)}>Accept</button>
                    <button className="btn btn-danger rounded-pill" onClick={() => cancelApp(app.id, app.carId)}>Cancel</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-center text-dark mt-5 mb-3">Rented Cars</h2>
        <div className="row">
          {cars.filter(c => c.confirmed).map(car => (
            <div key={car.id} className="col-md-6 mb-4">
              <div className="card bg-secondary text-white shadow p-3">
                <h4>{car.name}</h4>
                <p><strong>Renter:</strong> {car.renterName}</p>
                <p><strong>Phone:</strong> {car.renterPhone}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-light rounded-pill" onClick={() => setSelectedRented(car)}>Info</button>
                  <button className="btn btn-warning rounded-pill" onClick={() => unrentCar(car.id)}>Unrent</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center text-dark mt-5 mb-3">Add New Car</h2>
        <form onSubmit={addCar} className="p-4 mx-auto text-white bg-secondary shadow" style={{ maxWidth: '800px', borderRadius: '10px' }}>
          <div className="row g-4">
            <div className="col-md-6"><input type="text" className="form-control custom-input" placeholder="Car Name" name="name" value={formData.name} onChange={handleInput} required /></div>
            <div className="col-md-6"><input type="text" className="form-control custom-input" placeholder="Image URL" name="image" value={formData.image} onChange={handleInput} required /></div>
            <div className="col-md-6"><input type="number" className="form-control custom-input" placeholder="Price per Day" name="price" value={formData.price} onChange={handleInput} required /></div>
            <div className="col-md-6"><input type="text" className="form-control custom-input" placeholder="Model Year" name="model" value={formData.model} onChange={handleInput} required /></div>
            <div className="col-md-6">
              <select className="form-select custom-input bg-secondary-subtle text-dark" name="category" value={formData.category} onChange={handleInput} required>
                <option value="">Select Category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Sports">Sports</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
            <div className="col-12"><textarea className="form-control custom-input" rows={3} placeholder="Description" name="description" value={formData.description} onChange={handleInput} required /></div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-light px-5 rounded-pill fw-bold">Add Car</button>
            </div>
          </div>
        </form>
      </div>

      {/* Application Modal */}
      {selectedApp && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title">Application Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedApp(null)}></button>
              </div>
              <div className="modal-body d-flex">
                <img src={selectedApp.car.image} alt="car" style={{ width: '50%', height: '300px', objectFit: 'cover' }} />
                <div className="ms-4">
                  <p><strong>Name:</strong> {selectedApp.app.name}</p>
                  <p><strong>Email:</strong> {selectedApp.app.email}</p>
                  <p><strong>Phone:</strong> {selectedApp.app.phone}</p>
                  <p><strong>Pickup:</strong> {selectedApp.app.pickup}</p>
                  <p><strong>Return:</strong> {selectedApp.app.return}</p>
                  <p><strong>Days:</strong> {selectedApp.app.days}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rented Car Modal */}
      {selectedRented && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title">Rented Car Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedRented(null)}></button>
              </div>
              <div className="modal-body d-flex">
                <img src={selectedRented.image} alt="car" style={{ width: '50%', height: '300px', objectFit: 'cover' }} />
                <div className="ms-4">
                  <p><strong>Renter:</strong> {selectedRented.renterName}</p>
                  <p><strong>Phone:</strong> {selectedRented.renterPhone}</p>
                  <p><strong>Pickup:</strong> {selectedRented.pickup}</p>
                  <p><strong>Return:</strong> {selectedRented.return}</p>
                  <p><strong>Days:</strong> {selectedRented.days}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Car Confirmation Modal */}
      {newCarConfirm && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white rounded shadow">
              <div className="modal-header">
                <h5 className="modal-title">Car Added Successfully</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setNewCarConfirm(null)}></button>
              </div>
              <div className="modal-body d-flex">
                <img src={newCarConfirm.image} alt="car" style={{ width: '50%', height: '300px', objectFit: 'cover' }} />
                <div className="ms-4">
                  <p><strong>Name:</strong> {newCarConfirm.name}</p>
                  <p><strong>Category:</strong> {newCarConfirm.category}</p>
                  <p><strong>Model:</strong> {newCarConfirm.model}</p>
                  <p><strong>Price:</strong> ${newCarConfirm.price}</p>
                  <p><strong>Description:</strong> {newCarConfirm.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="btn btn-dark position-fixed bottom-0 end-0 m-4 rounded-pill px-4 py-2">Logout</button>

      {/* Embedded styles */}
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
    </div>
  );
};

export default Admin;
