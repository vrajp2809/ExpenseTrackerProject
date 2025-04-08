/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { UserNavbar } from "./UserNavbar";
import { Outlet, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../assets/sidebar.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 200;
const miniDrawerWidth = 60;

export const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <UserNavbar toggleDrawer={() => setOpen(!open)} />

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : miniDrawerWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            backgroundColor: "#2E2E2E", // Black sidebar
            color: "#ffffff", // White text
          },
        }}
      >
        {/* Sidebar Header (Logo/Icon) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 70,
            borderBottom: "1px solid #333",
          }}
        >
          <WalletIcon sx={{ fontSize: 40, color: "#fff" }} />
        </Box>

        {/* Sidebar Menu */}
        <List>
          <ListItem
            button
            component={Link}
            to="dashboard"
            sx={{
              backgroundColor: location.pathname.includes("dashboard")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("dashboard")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("dashboard")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("dashboard")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon
                sx={{ color: "#fff" }}
              />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Dashboard"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="account"
            sx={{
              backgroundColor: location.pathname.includes("account")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("account")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("account")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("account")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <AccountBalanceIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Accounts"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="addtransaction"
            sx={{
              backgroundColor: location.pathname.includes("addtransaction")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("addtransaction")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("addtransaction")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("addtransaction")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <AddCircleIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Add Transaction"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="viewTransaction"
            sx={{
              backgroundColor: location.pathname.includes("viewTransaction")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("viewTransaction")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("viewTransaction")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("viewTransaction")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <ViewListIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="View Transactions"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="income"
            sx={{
              backgroundColor: location.pathname.includes("income")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("income")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("income")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("income")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <BarChartIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Income"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="expense"
            sx={{
              backgroundColor: location.pathname.includes("expense")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("expense")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("expense")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("expense")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <ShoppingCartIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Expenses"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          <ListItem
            button
            component={Link}
            to="export"
            sx={{
              backgroundColor: location.pathname.includes("export")
                ? "#007bff"
                : "transparent", // Blue when selected
              color: location.pathname.includes("export")
                ? "#fff"
                : "inherit", // White text/icon when active
              "&:hover": {
                backgroundColor: location.pathname.includes("export")
                  ? "#007bff"
                  : "#444", // Keep blue if selected, otherwise dark gray
                color: location.pathname.includes("export")
                  ? "#fff"
                  : "inherit", // White if selected, otherwise normal
              },
            }}
          >
            <ListItemIcon>
              <CloudDownloadIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Export Data"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>

          

          

          {/* Sign Out */}
          <ListItem
            button
            onClick={handleSignOut}
            sx={{
              "&:hover": { backgroundColor: "#444", color: "#444" },
              cursor: "pointer", // Show hand cursor on hover
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Sign Out"
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
            )}
          </ListItem>
        </List>
      </Drawer>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
