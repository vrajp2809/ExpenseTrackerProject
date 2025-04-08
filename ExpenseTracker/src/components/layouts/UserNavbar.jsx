/* eslint-disable no-unused-vars */
import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import "../../assets/navbar.css"; // Import CSS file for styling

export const UserNavbar = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("id");

  const handleProfileClick = () => {
    navigate("/user/profile");
  };

  return (
    <nav className="app-header navbar navbar-expand custom-navbar" >
      <div className="container-fluid">
        <IconButton edge="start" className="menu-button" onClick={toggleDrawer} >
          <MenuIcon />
        </IconButton>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link1 d-flex align-items-center user-profile-link"
              onClick={handleProfileClick}
              style={{
                backgroundColor: location.pathname.includes("profile")
                  ? "#007bff"
                  : "transparent", // Blue when selected
                color: location.pathname.includes("profile") ? "#fff" : "inherit", // White text/icon when active
                padding: "8px 12px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
              }}
            >
              <i
                className="bi bi-person-circle me-2 user-profile-icon"
                style={{
                  color: location.pathname.includes("profile") ? "#fff" : "inherit",
                }}
              />
              <span
                className="fw-semibold user-profile-text"
                style={{
                  color: location.pathname.includes("profile") ? "#fff" : "inherit",
                }}
              >
                User Profile
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Add PropTypes validation
UserNavbar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};
