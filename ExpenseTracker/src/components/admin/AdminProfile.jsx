/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Card, Typography, Avatar, Divider, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";

export const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState("");

  const adminId = localStorage.getItem("id"); // assuming admin's ID is stored here

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userResponse = await axios.get(`/user/${adminId}`);
        const adminData = userResponse.data?.data || {};
        setAdmin(adminData);

        // Fetch Role
        if (adminData.roleId) {
          const roleResponse = await axios.get(`/roles/${adminData.roleId}`);
          setRole(roleResponse.data?.data?.name || "Unknown Role");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [adminId]);

  if (!admin) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar src={admin.imageURL} sx={{ width: 120, height: 120, bgcolor: "primary.main" }}>
              {!admin.imageURL && (admin?.firstName?.charAt(0)?.toUpperCase() || "A")}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight="bold">
              {admin?.firstName} {admin?.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">{admin?.email}</Typography>
            <Typography variant="body2" color="text.secondary">Role: {role}</Typography>
            <Typography variant="body2" color="text.secondary">Age: {admin?.age || "N/A"}</Typography>
            <Chip label={admin?.status ? "Active" : "Inactive"} color={admin?.status ? "success" : "error"} sx={{ mt: 1 }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          This is your admin profile. You have full access to manage the system.
        </Typography>
      </Card>
    </Container>
  );
};
