
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import Footer from './components/Footer';
import Booking from './pages/Booking';
import Cars from './pages/Cars';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="bg-secondary-subtle d-flex flex-column min-vh-100">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <HomeSection />
            </>
          } />
          <Route path="/cars" element={<Cars />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
