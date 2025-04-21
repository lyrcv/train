import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";

export const Header = () => {
  const {logout} = useContext(AuthContext); // Assuming you have a logout function in your Auth context
  return (
    <header>
      <div className="container">
        <Navbar expand="lg">
          <Navbar.Brand className="logo">
            <span>R</span>ivercrane Training
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="nav-link">
                Home
              </Nav.Link>
              <Nav.Link className="nav-link" onClick={logout}>
                Đăng xuất
              </Nav.Link>
              {/* <Nav.Link href="/users" className="nav-link">
                Users Management
              </Nav.Link>
              <Nav.Link href="/products" className="nav-link">
                Products Management
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;
