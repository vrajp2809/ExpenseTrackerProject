/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../../assets/loginStyle.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);

      if (res.status === 200) {
        toast.success("🎉 Login Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });

        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);

        setTimeout(() => {
          if (res.data.data.roleId.name === "USER") {
            navigate("/user/dashboard");
          } else if (res.data.data.roleId.name === "ADMIN") {
            navigate("/admin/dashboard");  // Redirect Admins to Admin Dashboard
          } else {
            navigate("/"); // Default fallback
          }
        }, 3000);
      }
    } catch (error) {
      toast.error("❌ Login Failed! Check your email or password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="background-radial-gradient d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Link to={'/'} style={{ textDecoration: "none" }}>
      <h1 className="expense-tracker-title">Expense Tracker</h1>
      </Link>

      <div className="card bg-glass">
        <h2 className="signup-title">Login</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="card-body">
            <TextField
              type="email"
              {...register("email")}
              className="form-control mb-3"
              placeholder="Email"
              fullWidth
            />

            <TextField
              {...register("password")}
              className="form-control mb-3"
              placeholder="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <input type="submit" className="btn btn-primary w-100 mb-3" value="Login" />
            <p className="mt-3">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};
