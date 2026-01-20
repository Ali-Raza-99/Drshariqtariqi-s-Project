import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Products from "./components/Products.jsx";
import KhidmatEKhalq from "./components/KhidmatEKhalq.jsx";
import Courses from "./components/Courses.jsx";
import MureedCounter from "./components/MureedCounter.jsx";
import AdminViewMureedRequests from "./components/admin/AdminViewMureedRequests.jsx";
import Appointment from "./components/Appointment.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Admin from "./components/admin/Admin.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminCourses from "./components/admin/AdminCourses.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import AdminNavbar from "./components/admin/AdminNavbar.jsx";
import AdminViewAppointments from "./components/admin/AdminViewAppointments.jsx";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/products" element={<Products />} />
      <Route path="/khidmat-e-khalq" element={<KhidmatEKhalq />} />
      <Route path="/ijtemai-qurbani" element={<Navigate to="/khidmat-e-khalq" replace />} />
      <Route path="/mureed-counter" element={<MureedCounter />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route
        path="/admin/mureed-requests"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <AdminViewMureedRequests />
            </>
          </AdminRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <Admin />
            </>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <AdminProducts />
            </>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <AdminCourses />
            </>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <AdminViewAppointments />
            </>
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