/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

export const AdminAddUser = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage && watchImage[0]) {
      const file = watchImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [watchImage]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("age", data.age);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("status", data.status);
    formData.append("roleId", "67c158104d349b7f6976d70e"); // Hardcoded roleId
    formData.append("image", data.image[0]);

    try {
      const res = await axios.post("/addWithProfile", formData);
      alert("User added successfully!");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Something went wrong while adding the user.");
    }
  };

  return (
    <Box sx={{ maxWidth: "700px", margin: "0 auto", p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Add New User
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register("firstName", { required: "First name is required" })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register("lastName", { required: "Last name is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>

          {/* Age */}
          <Grid item xs={12} >
            <TextField
              label="Age"
              type="number"
              fullWidth
              {...register("age", { required: "Age is required" })}
              error={!!errors.age}
              helperText={errors.age?.message}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Switch defaultChecked {...register("status")} />}
              label="Active"
            />
          </Grid>

          {/* Profile Image Upload */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Profile Picture
              <input type="file" hidden {...register("image")} />
            </Button>
          </Grid>

          {/* Image Preview */}
          {imagePreview && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                src={imagePreview}
                alt="Preview"
                sx={{ width: 100, height: 100, margin: "auto", mt: 2 }}
              />
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontSize: "16px", fontWeight: "bold" }}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
