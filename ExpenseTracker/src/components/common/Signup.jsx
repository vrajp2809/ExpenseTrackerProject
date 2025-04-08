/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../assets/loginStyle.css";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetState } from "@mantine/hooks";
import { FaUserCircle } from "react-icons/fa";

export const Signup = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [image, setimage] = useState(null)
  const [preview, setPreview] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(file);
      setPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };


  const submitHandler = async (data) => {
    try {
      data.roleId = "67c158104d349b7f6976d70e";

      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("age", data.age); // ✅ Add age
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("roleId", data.roleId);

      if(image){
        formData.append("image",image);
      }


      const res = await axios.post("/addWithProfile", formData,{
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.status === 201) {
        toast.success("✅ Signup Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle "Email already exists" error
        toast.error("⚠️ Email already exists! Try logging in.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      } else {
        // Handle general errors
        toast.error("❌ Signup Failed! Please try again.", {
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
    }
  };
  

  return (
    <div className="background-radial-gradient d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Link to={'/'} style={{ textDecoration: "none" }}>
      <h1 className="expense-tracker-title">Expense Tracker</h1> {/* Centered above the box */}
      </Link>

      <div className="card bg-glass">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <input type="text" {...register("firstName")} className="form-control" placeholder="First name" />
              </div>
              <div className="col-md-6 mb-3">
                <input type="text" {...register("lastName")} className="form-control" placeholder="Last name" />
              </div>
            </div>
            <input type="number" {...register("age")} className="form-control mb-3" placeholder="Age" />
            <input type="email" {...register("email")} className="form-control mb-3" placeholder="Email" />
            <input type="password" {...register("password")} className="form-control mb-3" placeholder="Password" />

            <input
              
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={(e) => setimage(e.target.files[0])}
            />
            <input type="submit" className="btn btn-primary w-100 mb-3" value="Sign Up" />
            <p className="mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Toast Container to display toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

