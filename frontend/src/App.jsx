import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/frontend/Home";
import UsersList from "./components/frontend/UsersList";
import ProductsList from "./components/frontend/ProductsList";
import Login from "./components/auth/Login";
import { RequireAuth } from "./components/auth/RequireAuth";
import "./assets/css/style.scss";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/frontend/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersList />
            </RequireAuth>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAuth>
              <ProductsList />
            </RequireAuth>
          }
        />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
