import { ToastContainer } from 'react-toastify';
 
import React from "react"; // ✅ add this line
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointements from "./pages/MyAppointements";
import Appointment from "./pages/Appointment";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/doctors" element={<Doctor />} />
  <Route path="/doctors/:speciality" element={<Doctor />} />
  <Route path="/login" element={<Login />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/my-profile" element={<MyProfile />} />          // exact case
  <Route path="/my-appointements" element={<MyAppointements />} /> // exact spelling
  <Route path="/appointment/:docId" element={<Appointment />} />
  <Route path="/my-appointment" element={<MyAppointements />} />

</Routes>
   <Footer></Footer>
    </div>
  );
};

export default App;


