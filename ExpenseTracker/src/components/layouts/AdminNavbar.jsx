/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom"; // Import Link
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../assets/navbar.css";

export const AdminNavbar = ({ toggleDrawer }) => {
  return (
    <nav className="app-header navbar navbar-expand custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <IconButton edge="start" className="menu-button" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>

        {/* Profile Section Clickable */}
        <Link to="/admin/profile" className="text-decoration-none text-dark">
          <div className="admin-label d-flex align-items-center" style={{ cursor: "pointer" }}>
            <i className="bi bi-person-badge me-2 fs-5 text-white"></i>
            <span className="fw-bold fs-5 text-uppercase text-white">Admin User</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

AdminNavbar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};

export default AdminNavbar;
