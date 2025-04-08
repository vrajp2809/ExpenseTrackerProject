/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Avatar, Container, Grid, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

export const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    status: true,
    imageURL: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios.get(`/user/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);

        const userData = res.data?.data || res.data;
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          age: userData.age || "",
          status: userData.status || false,
          imageURL: userData.imageURL || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatedData = new FormData();
    updatedData.append("firstName", formData.firstName);
    updatedData.append("lastName", formData.lastName);
    updatedData.append("email", formData.email);
    updatedData.append("age", formData.age);
    updatedData.append("status", formData.status);
    
    if (imageFile) {
      updatedData.append("image", imageFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await axios.put(`/updateUser/${id}`, updatedData, config);
      alert("User updated successfully");
      navigate(`/admin/users/${id}`);
    } catch (err) {
      console.error("Error updating user", err);
      alert("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    // if (!confirmDelete) return;
  
    console.log("Deleting user with ID:", id);
  
    try {
      const response = await axios.delete(`/user/${id}`); // Ensure the correct API URL
      console.log("Delete Response:", response);
  
      alert("User deleted successfully");
      navigate("/admin/users"); // Redirect after deletion
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err);
      alert("Failed to delete user");
    }
  };
  

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 5, p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "#f0f8ff" }}>
      <Typography variant="h4" align="center" gutterBottom>Edit User</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Avatar src={formData.imageURL || "https://via.placeholder.com/150"} sx={{ width: 100, height: 100, border: "2px solid #1976d2" }} />
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" component="label">
              Upload Profile Picture
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit" disabled={updating}>
              {updating ? "Updating..." : "Save Changes"}
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Button variant="outlined" onClick={() => navigate(`/admin/users/${id}`)}>Cancel</Button>
          </Grid>
         
        </Grid>
      </form>
    </Container>
  );
};
