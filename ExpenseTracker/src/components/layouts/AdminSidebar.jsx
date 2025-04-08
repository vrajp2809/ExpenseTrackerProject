import "@fortawesome/fontawesome-free/css/all.min.css";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import DashboardIcon from "@mui/icons-material/Dashboard"; 
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GroupIcon from "@mui/icons-material/Group";
import StorageIcon from "@mui/icons-material/Storage";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../assets/sidebar.css";
import { AdminNavbar } from "./AdminNavbar";

const drawerWidth = 200;
const miniDrawerWidth = 60;

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <AdminNavbar toggleDrawer={() => setOpen(!open)} />

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
            backgroundColor: "#2E2E2E",
            color: "#ffffff",
          },
        }}
      >
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

        <List>
          {[
            { label: "Dashboard", icon: <DashboardIcon />, path: "dashboard" },
            { label: "Users", icon: <GroupIcon />, path: "users" },
            { label: "Transactions", icon: <StorageIcon />, path: "viewTransaction" },
            { label: "Export Data", icon: <FileDownloadIcon />, path: "export" },
            { label: "Add User", icon: <AccountCircleIcon />, path: "addUser" },
          ].map((item) => (
            <ListItem
              component={Link}
              to={item.path}
              key={item.label}
              sx={{
                backgroundColor: location.pathname.startsWith(`/admin/${item.path}`) ? "#007bff" : "transparent",
                color: location.pathname.startsWith(`/admin/${item.path}`) ? "#fff" : "inherit",
                "&:hover": {
                  backgroundColor: location.pathname.startsWith(`/admin/${item.path}`) ? "#007bff" : "#444",
                  color: location.pathname.startsWith(`/admin/${item.path}`) ? "#fff" : "inherit",
                },
                cursor: "pointer",
              }}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, { sx: { color: "#fff" } })}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  opacity: open ? 1 : 0, 
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
            </ListItem>
          ))}

          <ListItem
            button
            onClick={handleSignOut}
            sx={{
              "&:hover": { backgroundColor: "#444" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                opacity: open ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
