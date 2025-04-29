import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import UsersList from "./pages/Users/UsersList";
import ProductsList from "./pages/ProductsList";
import Login from "./pages/Auth/Login";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RedirectIfAuthenticated } from "./components/auth/RedirectIfAuthenticated";
import "./assets/styles/style.scss";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <Home />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

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
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
