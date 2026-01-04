import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Products from "./components/Products.jsx";
import IjmiatiQurbani from "./components/IjmiatiQurbani.jsx";
import Courses from "./components/Courses.jsx";
import Library from "./components/Library.jsx";
import MureedCounter from "./components/MureedCounter.jsx";
import IlmUlAdadadCalculator from "./components/IlmUlAdadadCalculator.jsx";
import Istikhara from "./components/Istikhara.jsx";
import Appointment from "./components/Appointment.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Admin from "./components/admin/Admin.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/library" element={<Library />} />
      <Route path="/products" element={<Products />} />
      <Route path="/ijtemai-qurbani" element={<IjmiatiQurbani />} />
      <Route path="/mureed-counter" element={<MureedCounter />} />
      <Route path="/ilm-ul-adadad-calculator" element={<IlmUlAdadadCalculator />} />
      <Route path="/istikhara" element={<Istikhara />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;